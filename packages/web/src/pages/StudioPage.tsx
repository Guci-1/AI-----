import { useParams } from "react-router-dom";
import type { ControlAction } from "@ai-panel/shared";
import { api } from "../lib/api";
import { useStudioState } from "../hooks/useStudioState";
import { useSSE } from "../hooks/useSSE";
import StudioStage from "../components/stage/StudioStage";

export default function StudioPage() {
  const { id } = useParams<{ id: string }>();
  const { state, applyEvent } = useStudioState(id!);
  useSSE(id!, applyEvent);

  const handleControl = (action: ControlAction) => {
    api.control(id!, action);
  };

  return (
    <div className="h-screen">
      <StudioStage state={state} onControl={handleControl} />
    </div>
  );
}
