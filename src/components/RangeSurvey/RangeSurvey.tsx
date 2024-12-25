import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { Trans } from "react-i18next";
import styles from './RangeSurvey.module.css';
import Button from "../Button/Button";
import { FiCheckCircle, FiPlay, FiPause } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import CommentDialog from "../../dialogs/CommentDialog";
import AngularAnswer from "../../models/AngularAnswer";

interface Point {
  x: number;
  y: number;
}

type RangeSurvey = {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onCommentSubmit: (comment: string) => void;
  onConfirm: (answer: AngularAnswer) => void;
  currentRecordingIndex: number;
  numberOfRecordings: number;
};

const RangeSurvey: React.FC<RangeSurvey> = ({
  isPlaying,
  onPlayToggle,
  onCommentSubmit,
  onConfirm,
  currentRecordingIndex,
  numberOfRecordings
}) => {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const angleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<'left' | 'right' | null>(null);
  const [hoverHandle, setHoverHandle] = useState<'left' | 'right' | null>(null);
  const [leftAngle, setLeftAngle] = useState<number>(-Math.PI * 0.5);
  const [rightAngle, setRightAngle] = useState<number>(Math.PI * 0.5);
  const [width, setWidth] = useState<number>(Math.PI * 0.25);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  const INTERACTION_THRESHOLD = 20;

  const calculateAngle = (point: Point, center: Point): number => {
    return Math.atan2(point.x - center.x, -(point.y - center.y));
  };

  const getPointFromAngle = (angle: number, center: Point, radius: number): Point => {
    return {
      x: center.x + Math.sin(angle) * radius,
      y: center.y - Math.cos(angle) * radius
    };
  };

  const distanceToLine = (point: Point, lineStart: Point, lineEnd: Point): number => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const getClosestHandle = (x: number, y: number): 'left' | 'right' | null => {
    const canvas = angleCanvasRef.current;
    if (!canvas) return null;

    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    const point = { x, y };

    const leftLineEnd = getPointFromAngle(leftAngle, center, radius);
    const rightLineEnd = getPointFromAngle(rightAngle, center, radius);

    const distToLeftLine = distanceToLine(point, center, leftLineEnd);
    const distToRightLine = distanceToLine(point, center, rightLineEnd);

    if (Math.min(distToLeftLine, distToRightLine) > INTERACTION_THRESHOLD) {
      return null;
    }

    return distToLeftLine < distToRightLine ? 'left' : 'right';
  };

  const drawAngleLines = () => {
    const canvas = angleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const radius = Math.min(canvas.width, canvas.height) * 0.4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawAngleLine = (angle: number, isLeft: boolean) => {
      const endPoint = getPointFromAngle(angle, center, radius);
      const isHovered = (isLeft && hoverHandle === 'left') || (!isLeft && hoverHandle === 'right');
      const isActive = (isLeft && activeHandle === 'left') || (!isLeft && activeHandle === 'right');

      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.strokeStyle = isHovered || isActive ? "#1d4ed8" : "#027bff";
      ctx.lineWidth = isHovered || isActive ? 4 : 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(endPoint.x, endPoint.y, isHovered || isActive ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = isHovered || isActive ? "#1d4ed8" : "#027bff";
      ctx.fill();
    };

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, radius, -Math.PI / 2 + leftAngle, -Math.PI / 2 + rightAngle);
    ctx.lineTo(center.x, center.y);
    ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
    ctx.fill();

    drawAngleLine(leftAngle, true);
    drawAngleLine(rightAngle, false);
  };

  const updateAngleFromClick = (x: number, y: number, handle: 'left' | 'right') => {
    const canvas = angleCanvasRef.current;
    if (!canvas) return;

    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const angle = calculateAngle({ x, y }, center);

    if (handle === 'left') {
      setLeftAngle(angle);
    } else {
      setRightAngle(angle);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = angleCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && activeHandle) {
      updateAngleFromClick(x, y, activeHandle);
    } else {
      const closestHandle = getClosestHandle(x, y);
      setHoverHandle(closestHandle);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = angleCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const selectedHandle = getClosestHandle(x, y);
    if (selectedHandle) {
      setActiveHandle(selectedHandle);
      updateAngleFromClick(x, y, selectedHandle);
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  const handleMouseLeave = () => {
    setHoverHandle(null);
    handleMouseUp();
  };

  useEffect(() => {
    const TWO_PI = 2 * Math.PI;
    const a1 = ((leftAngle % TWO_PI) + TWO_PI) % TWO_PI;
    const a2 = ((rightAngle % TWO_PI) + TWO_PI) % TWO_PI;
    const diff = a2 - a1;
    const angularDistance = ((diff % TWO_PI) + TWO_PI) % TWO_PI;
    setWidth(angularDistance);
  }, [leftAngle, rightAngle]);

  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.25;
        ctx.stroke();
      }
    }
  }, []);

  useEffect(() => {
    drawAngleLines();
  }, [leftAngle, rightAngle, hoverHandle, activeHandle]);

  const formatAngle = (angle: number | null): string => {
    const formatted = angle !== null ? (((angle * 180) / Math.PI)).toFixed(1) : "N/A";
    return formatted.padStart(6, ' ').replace(/ /g, '\u00A0');
  };

  const handleConfirm = () => {
    onConfirm({
      leftAngle: leftAngle * 180 / Math.PI,
      rightAngle: rightAngle * 180 / Math.PI,
      ensembleWidth: width * 180 / Math.PI
    });
  };

  const handleComment = () => {
    setIsCommentDialogOpen(!isCommentDialogOpen);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headingContainer}>
        <h2>
          <Trans i18nKey="rangeSurvey.heading">
            Mark the perceived left and right boundaries of the musical ensemble.
          </Trans>
        </h2>
        <h3>
          <Trans i18nKey="rangeSurvey.recordingProgress">
            Recording {{ current: currentRecordingIndex + 1 }} of {{ total: numberOfRecordings }}
          </Trans>
        </h3>
      </div>
      <div className={styles.stageNavigation}>
        <div className={`${styles.stage} step-stage`}>
          <canvas
            ref={backgroundCanvasRef}
            className={styles.canvas}
            width={500}
            height={500}
          />
          <div className={styles.head} />
          <canvas
            ref={angleCanvasRef}
            className={styles.canvas}
            width={500}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isDragging ? 'grabbing' : (hoverHandle ? 'grab' : 'default') }}
          />
        </div>
        {!isPlaying ? (
          <Button
            onClick={onPlayToggle}
            icon={<FiPlay size={24} />}
            style={{ gridArea: "3 / 1 / 4 / 2" }}
            className="step-play"
          >
            <Trans i18nKey="rangeSurvey.buttons.play">Play</Trans>
          </Button>
        ) : (
          <Button
            onClick={onPlayToggle}
            icon={<FiPause size={24} />}
            style={{ gridArea: "3 / 1 / 4 / 2" }}
            className="step-play"
          >
            <Trans i18nKey="rangeSurvey.buttons.pause">Pause</Trans>
          </Button>
        )}
        <Button
          onClick={handleComment}
          icon={<FaRegComment size={24} />}
          style={{ gridArea: "3 / 2 / 4 / 3" }}
          className="step-comment"
        >
          <Trans i18nKey="rangeSurvey.buttons.comment">Comment</Trans>
        </Button>
        <Button
          onClick={handleConfirm}
          icon={<FiCheckCircle size={24} />}
          style={{ gridArea: "3 / 3 / 4 / 4" }}
          className="step-confirm"
        >
          <Trans i18nKey="rangeSurvey.buttons.confirm">Confirm</Trans>
        </Button>

        <div className={`${styles.statContainer} step-ensemble-width`} style={{ gridArea: "4 / 2 / 5 / 3" }}>
          <div className={styles.label}><Trans i18nKey="rangeSurvey.stats.leftAngle">Left angle:</Trans>&nbsp;</div>
          <div className={styles.number}>{formatAngle(leftAngle)}°</div>
          <div className={styles.label}><Trans i18nKey="rangeSurvey.stats.rightAngle">Right angle:</Trans>&nbsp;</div>
          <div className={styles.number}>{formatAngle(rightAngle)}°</div>
          <div className={styles.label}><Trans i18nKey="rangeSurvey.stats.ensembleWidth">Ensemble width:</Trans>&nbsp;</div>
          <div className={styles.number}>{formatAngle(width)}°</div>
        </div>
      </div>

      <CommentDialog
        isOpen={isCommentDialogOpen}
        onClose={() => setIsCommentDialogOpen(false)}
        onSubmit={onCommentSubmit}
      />
    </div>
  );
};

export default RangeSurvey;