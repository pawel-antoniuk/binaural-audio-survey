import React, { useRef, useState, MouseEvent, useEffect } from "react";
import styles from './SketchSurvey.module.css';
import { AngleTracker, Point, AngleExtremes } from './AngleTracker';
import Button from "../Button/Button";
import { FiTrash, FiCheckCircle, FiPlay } from "react-icons/fi";
import { FaUndo } from "react-icons/fa";

const SketchSurvey: React.FC = () => {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement>(null);
  const angleCanvasRef = useRef<HTMLCanvasElement>(null);
  const trackerRef = useRef(new AngleTracker());

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [lineHistorySteps, setLineHistorySteps] = useState<number[]>([]);
  const [extremes, setAngleExtremes] = useState<AngleExtremes>({ min: null, max: null, width: null });

  const updateLine = (from: Point, to: Point) => {
    const canvas = lineCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    const newPoint = { x: to.x, y: to.y };
    const center = { x: canvas.width / 2, y: canvas.height / 2 };

    setCurrentLine((prevLine) => [...prevLine, newPoint]);
    trackerRef.current.addPoint(newPoint, center);
    setAngleExtremes(trackerRef.current.getExtremes());
  }

  const drawAngles = (minAngle: number | null, maxAngle: number | null) => {
    const canvas = angleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const center = { x: canvas.width / 2, y: canvas.height / 2 };

    const drawAngle = (angle: number) => {
      const endpoint = {
        x: center.x + canvas.width * Math.cos(angle),
        y: center.y + canvas.height * Math.sin(angle),
      };

      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(endpoint.x, endpoint.y);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (minAngle !== null) {
      drawAngle(minAngle);
    }
    if (maxAngle !== null) {
      drawAngle(maxAngle);
    }
  }

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);

    const { offsetX, offsetY } = e.nativeEvent;
    updateLine({ x: offsetX, y: offsetY }, { x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };

    updateLine(currentLine[currentLine.length - 1], newPoint);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLineHistorySteps((prevSteps) => [...prevSteps, currentLine.length]);
    console.log(lineHistorySteps);
  };

  const handleMouseLeave = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLineHistorySteps((prevSteps) => [...prevSteps, currentLine.length]);
    console.log(lineHistorySteps);
  };

  useEffect(() => {
    drawAngles(extremes.min, extremes.max);
  }, [extremes]);

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

  const formatAngle = (angle: number | null): string => {
    const formatted = angle !== null ? ((angle * 180) / Math.PI).toFixed(1) : "N/A";
    return formatted.padStart(6, ' ').replace(/ /g, '\u00A0');
  };

  const handleClick = () => {
    alert("Button clicked!");
  };

  const clearLine = () => {
    const canvas = lineCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCurrentLine([]);
    trackerRef.current = new AngleTracker();
    setAngleExtremes({ min: null, max: null, width: null });
  }

  const undoLine = () => {
    const canvas = lineCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (lineHistorySteps.length === 0) return;

    const lastStep = lineHistorySteps[lineHistorySteps.length - 1];
    setLineHistorySteps((prevSteps) => prevSteps.slice(0, -1));

    console.log(lastStep);

    const newLine = currentLine.slice(0, -lastStep);
    setCurrentLine(newLine);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className={styles.mainContainer}>
      <h2>Mark the Width of the Audio Ensemble</h2>
      <div className={styles.stageNavigation}>
        <div className={styles.stage}>
          <canvas
            ref={backgroundCanvasRef}
            className={styles.canvas}
            width={500}
            height={500}
          ></canvas>
          <canvas
            ref={angleCanvasRef}
            className={styles.canvas}
            width={500}
            height={500}
          ></canvas>
          <div className={styles.head}></div>
          <canvas
            ref={lineCanvasRef}
            className={styles.canvas}
            width={500}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          ></canvas>
        </div>
        <Button
          onClick={undoLine}
          icon={<FaUndo size={24} />}
          style={{ gridArea: "1 / 1 / 2 / 2" }}
          caption="Undo"
        />
        <Button
          onClick={clearLine}
          icon={<FiTrash size={24} />}
          style={{ gridArea: "1 / 3 / 2 / 4" }}
          caption="Clear"
        />
        <Button
          onClick={handleClick}
          icon={<FiCheckCircle size={24} />}
          style={{ gridArea: "3 / 3 / 4 / 4" }}
          caption="Confirm"
        />
        <Button
          onClick={handleClick}
          icon={<FiPlay size={24} />}
          style={{ gridArea: "3 / 1 / 4 / 2" }}
          caption="Play"
        />
        <div className={styles.statContainer}
          style={{ gridArea: "3 / 2 / 4 / 3" }}>
          <div className={styles.statBox}>
            <p>Angle A:&nbsp;</p>
            <p>Angle B:&nbsp;</p>
            <p>Ensemble Width:&nbsp;</p>
          </div>
          <div className={styles.statBox}>
            <p>{formatAngle(extremes.min)}°</p>
            <p>{formatAngle(extremes.max)}°</p>
            <p>{formatAngle(extremes.width)}°</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SketchSurvey;