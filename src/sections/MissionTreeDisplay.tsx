import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FINAL_MISSION, Mission, ROOT_MISSION } from '../data/missions';
import './MissionTree.css';

import classNames from 'classnames';
import { z } from 'zod';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import rehypeRaw from 'rehype-raw';

const storageSchema = z.record(z.string(), z.boolean());
const loadMissionStates = () => {
  const baseState: Record<string, boolean> = {};

  const missionQueue: Mission[] = [ROOT_MISSION];
  while (missionQueue.length > 0) {
    const mission = missionQueue.shift()!;
    baseState[mission.name] = false; // Initialize all missions as not completed
    missionQueue.push(...mission.children);
  }

  try {
    const storedState = localStorage.getItem('missions') || '{}';
    const parsedState = storageSchema.safeParse(JSON.parse(storedState));
    if (parsedState.success) {
      for (const [missionName, completed] of Object.entries(parsedState.data)) {
        if (Object.prototype.hasOwnProperty.call(baseState, missionName)) {
          baseState[missionName] = completed;
        }
        else {
          console.warn(`Unknown mission "${missionName}" in stored state.`);
        }
      }
    }
    else {
      console.error('Invalid stored state', parsedState.error);
    }
  }
  catch (error) {
    console.error('Error loading mission states', error);
  }
  return baseState;
};

const MissionTreeContext = createContext<{
  missionStates: Record<string, boolean>
  setMissionState: (missionName: string, completed: boolean) => void
}>({
      missionStates: {},
      setMissionState: () => {},
    });

export const MissionTreeContextProvider = ({
  children,
}: PropsWithChildren<object>) => {
  const [missionStates, setMissionStates] = useState<Record<string, boolean>>(
    loadMissionStates(),
  );

  const setMissionState = (missionName: string, completed: boolean) => {
    setMissionStates(prev => ({
      ...prev,
      [missionName]: completed,
    }));
  };

  useEffect(() => {
    localStorage.setItem('missions', JSON.stringify(missionStates));
  }, [missionStates]);

  return (
    <MissionTreeContext.Provider value={{ missionStates, setMissionState }}>
      {children}
    </MissionTreeContext.Provider>
  );
};

// Draw functions

const rowHeight = 28;
const colWidth = 37;
const boxSize = 20;
const connectOffset = 3;

// build mission node tree, draw connections
const missionNodes: { mission: Mission, x: number, y: number }[] = [];

const addMissionNode = (mission: Mission, x: number, y: number) => {
  missionNodes.push({ mission, x, y });
};

const getHoveredNode = (mouseX: number, mouseY: number) => {
  return missionNodes.find((node) => {
    return (
      mouseX >= node.x - boxSize / 2
      && mouseX <= node.x + boxSize / 2
      && mouseY >= node.y - boxSize / 2
      && mouseY <= node.y + boxSize / 2
    );
  });
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
  flags: { isHovered: boolean, isCompleted: boolean },
) => {
  const { isHovered, isCompleted } = flags;
  const fillStyle = isCompleted ? '#10f898' : '#333';
  // fillStyle = isHovered ? (isCompleted ? "#c00" : "#cc0") : fillStyle;
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);

  if (isHovered) {
    ctx.strokeStyle = isCompleted ? '#c00' : '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      x - boxSize / 2 + 1,
      y - boxSize / 2 + 1,
      boxSize - 2,
      boxSize - 2,
    );
  }
};

const drawLock = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = '#fff';
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

  ctx.strokeStyle = '#fff';
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
  const { missionStates, setMissionState } = useContext(MissionTreeContext);

  const [hoveredMission, setHoveredMission] = useState<Mission | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getMissionState = (name: string) => missionStates[name] || false;

  const toggleMissionState = useRef<(missionName: string) => boolean>(
    () => false,
  );

  const drawMissionNodes = useRef<
    (ctx: CanvasRenderingContext2D, hoveredNode?: Mission) => void
      >(() => {});

  const allOtherMissionsCompleted = Array.from(
    Object.entries(missionStates),
  ).every(([name, completed]) => name === FINAL_MISSION.name || completed);

  const finalMissionLocked = !allOtherMissionsCompleted;

  useEffect(() => {
    drawMissionNodes.current = (
      ctx: CanvasRenderingContext2D,
      hoveredNode?: Mission,
    ) => {
      for (const { mission, x, y } of missionNodes) {
        const { name } = mission;
        const isHovered = hoveredNode == mission;

        const isCompleted = getMissionState(name);
        drawNode(ctx, x, y, { isHovered, isCompleted });
        if (mission === FINAL_MISSION && finalMissionLocked) {
          drawLock(ctx, x, y);
        }
      }
    };
    toggleMissionState.current = (missionName: string) => {
      const newState = !getMissionState(missionName);
      setMissionState(missionName, newState);
      return newState;
    };
  }, [missionStates]);

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
      const canvasOffsetY = clientHeight / 2;

      if (canvasOffsetX < 0) {
        return;
      }

      ctx.save();
      ctx.translate(canvasOffsetX, canvasOffsetY);

      const queue: { mission: Mission, x: number, y: number }[] = [
        { mission: ROOT_MISSION, x: 0, y: 0 },
      ];

      while (queue.length > 0) {
        const { mission, x, y } = queue.shift()!;

        // Draw the mission box
        addMissionNode(mission, x, y);

        // Draw the mission name
        // ctx.fillStyle = "black";
        // ctx.fillText(mission.name, x + 5, y +15);

        // Draw lines to children
        const children = mission.children;
        if (children.length > 0) {
          const childX = x + colWidth;

          const mainChildren = children.filter(c => c.flags.main);
          const sideChildren = children.filter(c => !c.flags.main);

          if (mission.flags.main) {
            if (mainChildren.length > 0) {
              const mainChild = mainChildren[0];
              const childY = y;
              drawConnectingLine(ctx, x, y, childX, childY);
              queue.push({ mission: mainChild, x: childX, y: childY });
            }

            if (sideChildren.length > 0) {
              const offsets: number[] = [-1, 1, -2, 2];
              sideChildren.forEach((sideChild, index) => {
                const childX = x + colWidth;
                const thisOffset
                  = sideChild.flags.offset ?? offsets[index % offsets.length];
                const childY = y + thisOffset * rowHeight;
                drawConnectingLine(ctx, x, y, childX, childY);
                queue.push({ mission: sideChild, x: childX, y: childY });
              });
            }
          }
          else {
            const child = mission.children[0];
            const childY = y;
            drawConnectingLine(ctx, x, y, childX, childY);
            queue.push({ mission: child, x: childX, y: childY });
          }
        }
      }

      canvasRef.current.addEventListener('mousemove', (e) => {
        const mouseX = e.offsetX - canvasOffsetX;
        const mouseY = e.offsetY - canvasOffsetY;

        const hoveredNode = getHoveredNode(mouseX, mouseY);
        if (hoveredNode) {
          canvasRef.current!.style.cursor = 'pointer';
          setHoveredMission(hoveredNode.mission);
        }
        else {
          setHoveredMission(null);
          canvasRef.current!.style.cursor = 'default';
        }

        drawMissionNodes.current(ctx, hoveredNode?.mission);
      });

      canvasRef.current.addEventListener('click', (e) => {
        const mouseX = e.offsetX - canvasOffsetX;
        const mouseY = e.offsetY - canvasOffsetY;

        const hoveredNode = getHoveredNode(mouseX, mouseY);

        if (hoveredNode) {
          // If shift is pressed, toggle everything up to this mission in the tree
          if (e.shiftKey) {
            let current: Mission | null = hoveredNode.mission;
            const newState = toggleMissionState.current(current.name);
            while (current) {
              setMissionState(current.name, newState);
              current = current.parent;
            }
            setTimeout(() => drawMissionNodes.current(ctx), 100);
            return;
          }

          const newState = toggleMissionState.current(hoveredNode.mission.name);
          drawNode(ctx, hoveredNode.x, hoveredNode.y, {
            isHovered: true,
            isCompleted: newState,
          });
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
    = hoveredMission && getMissionState(hoveredMission.name);

  const totalMissions = Array.from(Object.values(missionStates)).length;
  const completedMissions = Array.from(Object.values(missionStates)).filter(
    m => m,
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
          )}
    </div>
  );
};
