import {
  CreateHellInput,
  UpdateHellInput,
  useArchiveHellMutation,
  useCreateHellMutation,
  Hell,
  useUpdateHellMutation,
} from "@/generated/graphql";
import { useHellStore } from "@/stores/hell.store";
import { Pencil } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "./use-toast";

export function useHells() {
  const [{ fetching: createMutating, error: createError }, createHell] =
    useCreateHellMutation();
  const [{ fetching: updateMutating, error: updateError }, updateHell] =
    useUpdateHellMutation();
  // archive
  const [{ fetching: archiveMutating, error: archiveError }, archive] =
    useArchiveHellMutation();

  const { toast } = useToast();

  const create = async (payload: CreateHellInput) => {
    try {
      await createHell({ input: payload });
    } catch (createError) {
      toast({
        title: "Error",
        description: createError.message as string,
        variant: "destructive",
      });
    }
  };

  const archiveHell = async (id: number) => {
    try {
      await archive({ id });
    } catch (deleteError) {
      toast({
        title: "Error",
        description: deleteError.message as string,
        variant: "destructive",
      });
    }
  };

  const edit = async (payload: UpdateHellInput) => {
    try {
      await updateHell({ input: payload });
    } catch (updateError) {
      toast({
        title: "Error",
        description: updateError.message as string,
        variant: "destructive",
      });
    }
  };

  const { setIsDeleting, setIsEditing, setIsCreating } = useHellStore();

  const handleClickMenu = useCallback(
    (hellId: string, action: string) => {
      if (action === "edit") setIsEditing(hellId);
      else if (action === "archive") setIsDeleting(hellId);
    },
    [setIsEditing, setIsDeleting]
  );

  const handleClose = useCallback(() => {
    setIsCreating(null);
    setIsEditing(null);
    setIsDeleting(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ellipsisConfig = useCallback(
    (row: Hell) => {
      return [
        {
          name: "View",
          onClick: () => {
            console.log(row);
          },
          disabled: false,
        },
        {
          name: "Edit",
          onClick: () => {
            handleClickMenu(row.id, "edit");
          },
          icon: <Pencil size={15} />,
          disabled: false,
        },
        {
          name: "Archive",
          onClick: () => {
            handleClickMenu(row.id, "archive");
          },
          danger: true,
          disabled: false,
        },
      ];
    },
    [handleClickMenu]
  );

  return {
    createMutating,
    create,
    edit,
    updateMutating,
    updateError,
    archiveMutating,
    archiveHell,
    archiveError,
    handleClose,
    createError,
    ellipsisConfig,
    handleClickMenu,
  };
}