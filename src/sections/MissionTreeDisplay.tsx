import {
  createContext,
  JSX,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Mission, ROOT_MISSION } from "./data/missions";
import "./MissionTree.css";

import classNames from "classnames";
import { z } from "zod";
import { throttle } from "lodash";

const storageSchema = z.record(z.string(), z.boolean());
const loadMissionStates = () => {
  const baseState: Record<string, boolean> = {};

  let missionQueue: Mission[] = [ROOT_MISSION];
  while (missionQueue.length > 0) {
    const mission = missionQueue.shift()!;
    baseState[mission.name] = false; // Initialize all missions as not completed
    missionQueue.push(...mission.children);
  }

  try {
    const storedState = localStorage.getItem("missions") || "{}";
    const parsedState = storageSchema.safeParse(JSON.parse(storedState));
    if (parsedState.success) {
      for (const [missionName, completed] of Object.entries(parsedState.data)) {
        if (baseState.hasOwnProperty(missionName)) {
          baseState[missionName] = completed;
        } else {
          console.warn(`Unknown mission "${missionName}" in stored state.`);
        }
      }
    } else {
      console.error("Invalid stored state", parsedState.error);
    }
  } catch (error) {
    console.error("Error loading mission states", error);
  }
  return baseState;
};

const MissionTreeContext = createContext<{
  missionStates: Record<string, boolean>;
  setMissionState: (missionName: string, completed: boolean) => void;
}>({
  missionStates: {},
  setMissionState: () => {},
});

export const MissionTreeContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [missionStates, setMissionStates] = useState<Record<string, boolean>>(
    loadMissionStates()
  );

  const setMissionState = (missionName: string, completed: boolean) => {
    setMissionStates((prev) => ({
      ...prev,
      [missionName]: completed,
    }));
  };

  useEffect(() => {
    localStorage.setItem("missions", JSON.stringify(missionStates));
  }, [missionStates]);

  return (
    <MissionTreeContext.Provider value={{ missionStates, setMissionState }}>
      {children}
    </MissionTreeContext.Provider>
  );
};

// Draw functions

const rowHeight = 35;
const colWidth = 50;
const boxSize = 20;
const connectOffset = 3;

// build mission node tree, draw connections
let missionNodes: { mission: Mission; x: number; y: number }[] = [];

const addMissionNode = (mission: Mission, x: number, y: number) => {
  missionNodes.push({ mission, x, y });
};

const getHoveredNode = (mouseX: number, mouseY: number) => {
  return missionNodes.find((node) => {
    return (
      mouseX >= node.x - boxSize / 2 &&
      mouseX <= node.x + boxSize / 2 &&
      mouseY >= node.y - boxSize / 2 &&
      mouseY <= node.y + boxSize / 2
    );
  });
};

const drawConnectingLine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  childX: number,
  childY: number
) => {
  ctx.strokeStyle = "grey";
  ctx.beginPath();
  ctx.moveTo(x + boxSize / 2 + connectOffset, y);
  ctx.lineTo(childX - connectOffset - boxSize / 2, childY);
  ctx.stroke();
  ctx.fillStyle = "lightgrey";
  ctx.fillRect(x + boxSize / 2 + connectOffset, y - 1, 2, 2);
  ctx.fillRect(childX - boxSize / 2 - connectOffset, childY - 1, 2, 2);
};

const drawNode = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  flags: { isHovered: boolean; isCompleted: boolean }
) => {
  const { isHovered, isCompleted } = flags;
  let fillStyle = isCompleted ? "#10f898" : "#333";
  // fillStyle = isHovered ? (isCompleted ? "#c00" : "#cc0") : fillStyle;
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);

  if (isHovered) {
    ctx.strokeStyle = isCompleted ? "#c00" : "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      x - boxSize / 2 + 1,
      y - boxSize / 2 + 1,
      boxSize - 2,
      boxSize - 2
    );
  }
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
    () => false
  );

  const drawMissionNodes = useRef(
    (ctx: CanvasRenderingContext2D, hoveredNode?: Mission) => {}
  );

  useEffect(() => {
    drawMissionNodes.current = (
      ctx: CanvasRenderingContext2D,
      hoveredNode?: Mission
    ) => {
      for (const { mission, x, y } of missionNodes) {
        const { name } = mission;
        const isHovered = hoveredNode == mission;

        const isCompleted = getMissionState(name);
        drawNode(ctx, x, y, { isHovered, isCompleted });
      }
    };
    toggleMissionState.current = (missionName: string) => {
      const newState = !getMissionState(missionName);
      setMissionState(missionName, newState);
      return newState;
    };
  }, [missionStates]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    // Set HTML width and height to match displayed width and height
    canvasRef.current.width = canvasRef.current.offsetWidth;
    canvasRef.current.height = canvasRef.current.offsetHeight;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const canvasOffsetX =
      canvasRef.current.width / 2 - colWidth * (maxMissionDepth / 2);
    const canvasOffsetY = canvasRef.current.height / 2;

    if (canvasOffsetX < 0) {
      return;
    }

    ctx.save();
    ctx.translate(canvasOffsetX, canvasOffsetY);

    let queue: { mission: Mission; x: number; y: number }[] = [
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

        const mainChildren = children.filter((c) => c.flags.main);
        const sideChildren = children.filter((c) => !c.flags.main);

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
              const thisOffset =
                sideChild.flags.offset ?? offsets[index % offsets.length];
              const childY = y + thisOffset * rowHeight;
              drawConnectingLine(ctx, x, y, childX, childY);
              queue.push({ mission: sideChild, x: childX, y: childY });
            });
          }
        } else {
          const child = mission.children[0];
          const childY = y;
          drawConnectingLine(ctx, x, y, childX, childY);
          queue.push({ mission: child, x: childX, y: childY });
        }
      }
    }

    canvasRef.current.addEventListener("mousemove", (e) => {
      const mouseX = e.offsetX - canvasOffsetX;
      const mouseY = e.offsetY - canvasOffsetY;

      const hoveredNode = getHoveredNode(mouseX, mouseY);
      if (hoveredNode) {
        canvasRef.current!.style.cursor = "pointer";
        setHoveredMission(hoveredNode.mission);
      } else {
        setHoveredMission(null);
        canvasRef.current!.style.cursor = "default";
      }

      drawMissionNodes.current(ctx, hoveredNode?.mission);
    });

    canvasRef.current.addEventListener("click", (e) => {
      const mouseX = e.offsetX - canvasOffsetX;
      const mouseY = e.offsetY - canvasOffsetY;

      const hoveredNode = getHoveredNode(mouseX, mouseY);
      if (hoveredNode) {
        const newState = toggleMissionState.current(hoveredNode.mission.name);
        drawNode(ctx, hoveredNode.x, hoveredNode.y, {
          isHovered: true,
          isCompleted: newState,
        });
      }
    });

    drawMissionNodes.current(ctx);
  }, []);

  const hoveredMissionCompleted =
    hoveredMission && getMissionState(hoveredMission.name);

  const totalMissions = Array.from(Object.values(missionStates)).length;
  const completedMissions = Array.from(Object.values(missionStates)).filter(
    (m) => m
  ).length;

  return (
    <div className="MissionTree">
      <canvas ref={canvasRef} className="missionTreeCanvas" />
      {hoveredMission ? (
        <div
          className={classNames("missionDisplay", {
            completed: hoveredMissionCompleted,
          })}
        >
          <div className="name">{hoveredMission.name}</div>
          <div
            className={classNames("status", {
              completed: hoveredMissionCompleted,
            })}
          >
            {hoveredMissionCompleted ? "Complete" : "Incomplete"}
          </div>
        </div>
      ) : (
        <div className={"missionStats"}>
          Completed Missions: {completedMissions}/{totalMissions} (
          {((completedMissions / totalMissions) * 100).toFixed(1)}%)
        </div>
      )}
    </div>
  );
};
