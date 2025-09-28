import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Mission } from '../data/missions';
import { ROOT_MISSION, FINAL_MISSION, MISSION_DISPLAY_OFFSETS } from '../data/missions-wildfire';
import './MissionTree.css';

import classNames from 'classnames';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import rehypeRaw from 'rehype-raw';
import { MissionTreeContext } from './MissionTreeContext';

// Draw functions

const rowHeight = 28;
const colWidth = 37;
const boxSize = 20;
const connectOffset = 3;

// build mission node tree, draw connections
const missionNodes: Map<Mission, { x: number, y: number, offset: number }> = new Map();

const getHoveredMission = (mouseX: number, mouseY: number) => {
  return Array.from(missionNodes.entries()).find(([, node]) => {
    return (
      mouseX >= node.x - boxSize / 2
      && mouseX <= node.x + boxSize / 2
      && mouseY >= node.y - boxSize / 2
      && mouseY <= node.y + boxSize / 2
    );
  })?.[0];
};

const drawConnectingLine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  childX: number,
  childY: number,
) => {
  ctx.strokeStyle = 'grey';
  ctx.beginPath();
  ctx.moveTo(x + boxSize / 2 + connectOffset, y);
  ctx.lineTo(childX - connectOffset - boxSize / 2, childY);
  ctx.stroke();
  ctx.fillStyle = 'lightgrey';
  ctx.fillRect(x + boxSize / 2 + connectOffset, y - 1, 2, 2);
  ctx.fillRect(childX - boxSize / 2 - connectOffset, childY - 1, 2, 2);
};

const drawNode = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mission: Mission,
  isHovered: boolean,
) => {
  ctx.clearRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);
  const fillStyle = mission.completed ? '#10f898' : '#333';
  // fillStyle = isHovered ? (isCompleted ? "#c00" : "#cc0") : fillStyle;
  ctx.fillStyle = fillStyle;

  if (mission.isRealMission) {
    ctx.fillRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);

    // Draw stars for mission
    if (mission.stars > 0) {
      // draw number in the center
      // using green if mission is not completed, black if it is
      // bold font
      ctx.fillStyle = mission.completed ? '#000' : '#10f898';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(mission.stars.toString(), x, y);
    }

    if (mission.locked) {
      drawLock(ctx, x, y, mission.completed ? '#000' : '#fff');
    }

    if (isHovered) {
      ctx.strokeStyle = mission.completed ? '#c00' : '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        x - boxSize / 2 + 1,
        y - boxSize / 2 + 1,
        boxSize - 2,
        boxSize - 2,
      );
    }
  }

  if (mission.isDummyMission) {
    ctx.fillStyle = '#10f898';
    ctx.beginPath();
    ctx.arc(x, y, boxSize / 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  if (mission.isComputedMission) {
    ctx.clearRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize * 2);
    ctx.fillStyle = mission.completed ? '#10f898' : '#333';
    ctx.beginPath();
    ctx.arc(x, y, boxSize / 5, 0, 2 * Math.PI);
    ctx.fill();

    if (!mission.completed) {
      drawLock(ctx, x, y);

      if (mission.stars > 0) {
        // Draw number underneath
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(mission.stars.toString(), x, y + boxSize / 2 + 2);
      }
    }
  }
};

const drawLock = (ctx: CanvasRenderingContext2D, x: number, y: number, fill: string = '#fff') => {
  ctx.fillStyle = fill;
  const left = x - 6;
  const right = x + 6;
  const top = y - 2;
  const bottom = y + 8;

  const holeLeft = x - 2;
  const holeRight = x + 2;
  const holeTop = y;
  const holeBottom = y + 6;

  // const arcLeft = x - 4;
  // const arcRight = x + 4;

  ctx.beginPath();
  ctx.moveTo(holeLeft, y);
  ctx.lineTo(left, y);
  ctx.lineTo(left, top);
  ctx.lineTo(right, top);
  ctx.lineTo(right, bottom);
  ctx.lineTo(left, bottom);
  ctx.lineTo(left, y);
  ctx.lineTo(holeLeft, y);
  ctx.lineTo(holeLeft, holeBottom);
  ctx.lineTo(holeRight, holeBottom);
  ctx.lineTo(holeRight, holeTop);
  ctx.lineTo(holeLeft, holeTop);
  ctx.fill();

  ctx.strokeStyle = fill;
  ctx.beginPath();
  ctx.arc(x, top, 4, 0 - Math.PI, 0);
  ctx.stroke();
};

let maxMissionDepth = 0;
const updateMaxDepth = (m: Mission, depth: number) => {
  maxMissionDepth = Math.max(maxMissionDepth, depth);
  for (const child of m.children) {
    updateMaxDepth(child, depth + 1);
  }
};
updateMaxDepth(ROOT_MISSION, 1);

export const MissionTreeSection = () => {
  const { missionsByName } = useContext(MissionTreeContext);

  const [hoveredMission, setHoveredMission] = useState<Mission | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawMissionNodes = useRef<
    (ctx: CanvasRenderingContext2D, hoveredNode?: Mission) => void
      >(() => {});

  const allOtherMissionsCompleted = Array.from(
    Object.entries(missionsByName), // Change here
  ).every(([name, mission]) => name === FINAL_MISSION.name || mission.completed);

  const finalMissionLocked = !allOtherMissionsCompleted;

  useEffect(() => {
    drawMissionNodes.current = (
      ctx: CanvasRenderingContext2D,
      hoveredNode?: Mission,
    ) => {
      for (const [mission, { x, y }] of missionNodes.entries()) {
        const isHovered = hoveredNode == mission;
        drawNode(ctx, x, y, mission, isHovered);
        if (mission === FINAL_MISSION && finalMissionLocked) {
          drawLock(ctx, x, y);
        }
      }
    };
  }, [missionsByName]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (!canvasRef.current.dataset.init) {
      const clientWidth = canvasRef.current.offsetWidth;
      const clientHeight = canvasRef.current.offsetHeight;

      // Set HTML width and height to match displayed width and height
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;

      ctx.clearRect(0, 0, clientWidth, clientHeight);

      const canvasOffsetX = clientWidth / 2 - colWidth * (maxMissionDepth / 2);
      const canvasOffsetY = 20; // clientHeight / 2;

      if (canvasOffsetX < 0) {
        return;
      }

      ctx.save();
      ctx.translate(canvasOffsetX, canvasOffsetY);

      const queue: Mission[] = [ROOT_MISSION];

      const nodeOffsets: Map<Mission, number> = new Map();
      nodeOffsets.set(ROOT_MISSION, 0);

      while (queue.length > 0) {
        const mission = queue.shift()!;
        const parentChildIndex = mission.parent?.children.indexOf(mission) || 0;
        const offset = mission.offset || MISSION_DISPLAY_OFFSETS[parentChildIndex % MISSION_DISPLAY_OFFSETS.length];

        // Get x and y position of this mission's parent
        // and calculate new x and y for this mission based on parent position + y offset
        const parentPos = mission.parent ? missionNodes.get(mission.parent) : null;
        const x = parentPos ? parentPos.x + colWidth : 0;
        const y = parentPos ? parentPos.y + offset * rowHeight : 0;

        // If it has a parent, draw a connecting line back to it
        if (mission.parent) {
          drawConnectingLine(ctx, parentPos!.x, parentPos!.y, x, y);
        }

        // Store the mission node's position for hover detection and connection lines
        missionNodes.set(mission, { x, y, offset });

        for (const child of mission.children) {
          queue.push(child);
        }
      }

      canvasRef.current.addEventListener('mousemove', (e) => {
        const mouseX = e.offsetX - canvasOffsetX;
        const mouseY = e.offsetY - canvasOffsetY;

        const hoveredMission = getHoveredMission(mouseX, mouseY);
        if (hoveredMission?.isRealMission) {
          canvasRef.current!.style.cursor = 'pointer';
          setHoveredMission(hoveredMission);
        }
        else {
          setHoveredMission(null);
          canvasRef.current!.style.cursor = 'default';
        }

        drawMissionNodes.current(ctx, hoveredMission);
      });

      canvasRef.current.addEventListener('click', (e) => {
        const mouseX = e.offsetX - canvasOffsetX;
        const mouseY = e.offsetY - canvasOffsetY;

        const hoveredMission = getHoveredMission(mouseX, mouseY);

        if (hoveredMission) {
          if (!hoveredMission.isRealMission) {
            return;
          }

          const previousState = !!hoveredMission.completed;
          const newState = !previousState;

          hoveredMission.setComplete(newState);

          // If shift is pressed, toggle everything up to this mission in the tree
          if (e.shiftKey) {
            let current: Mission | null = hoveredMission;
            if (!current) {
              return;
            }
            while (current) {
              missionsByName[current.name].setComplete(newState);
              current = current.parent;
            }
            setTimeout(() => drawMissionNodes.current(ctx), 100);
            return;
          }

          if (!missionNodes.has(hoveredMission)) {
            return;
          }
          const { x, y } = missionNodes.get(hoveredMission)!;

          drawNode(ctx, x, y, hoveredMission, true);
          setTimeout(() => {
            drawMissionNodes.current(ctx);
          }, 100);
        }
      });

      canvasRef.current.dataset.init = 'true';
    }

    drawMissionNodes.current(ctx);
  }, []);

  const hoveredMissionCompleted
    = hoveredMission?.completed || false;

  const relevantMissions = Object.values(missionsByName).filter(m => m.isRealMission);

  const totalMissions = relevantMissions.length;
  const completedMissions = relevantMissions.filter(
    m => m.completed,
  ).length;

  const allMissionsComplete = completedMissions === totalMissions;

  // if (hoveredMission?.description?.includes('_')) {
  //   throw Error(`Unresolved markdown formatting issue in mission description: ${hoveredMission.description}`);
  // }
  const reactDescription = hoveredMission?.description
    ? (
        <div className="description">
          <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm, remarkGemoji]}>
            {hoveredMission.description}
          </Markdown>
        </div>
      )
    : null;

  return (
    <div className="MissionTree">
      <canvas
        ref={canvasRef}
        width="2000"
        height="200"
        className="missionTreeCanvas"
      />
      {hoveredMission
        ? (
            <div
              className={classNames('missionDisplay', {
                completed: hoveredMissionCompleted,
              })}
            >
              <div className="name">{hoveredMission.name}</div>
              {reactDescription}
              <div
                className={classNames('status', {
                  completed: hoveredMissionCompleted,
                })}
              >
                {hoveredMissionCompleted ? 'Complete' : 'Incomplete'}
              </div>
            </div>
          )
        : (
            <>
              <div
                className={classNames('missionStats', {
                  complete: allMissionsComplete,
                })}
              >
                Completed Missions:
                {' '}
                {completedMissions}
                /
                {totalMissions}
                {' '}
                (
                {((completedMissions / totalMissions) * 100).toFixed(1)}
                %)
              </div>
            </>
          )}
    </div>
  );
};
