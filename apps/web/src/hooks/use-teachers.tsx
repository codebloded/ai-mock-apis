import {
  CreateTeacherInput,
  UpdateTeacherInput,
  useArchiveTeacherMutation,
  useCreateTeacherMutation,
  Teacher,
  useUpdateTeacherMutation,
} from "@/generated/graphql";
import { useTeacherStore } from "@/stores/teacher.store";
import { Pencil } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "./use-toast";

export function useTeachers() {
  const [{ fetching: createMutating, error: createError }, createTeacher] =
    useCreateTeacherMutation();
  const [{ fetching: updateMutating, error: updateError }, updateTeacher] =
    useUpdateTeacherMutation();
  const [{ fetching: archiveMutating, error: archiveError }, archive] =
    useArchiveTeacherMutation();

  const { toast } = useToast();

  const create = async (payload: CreateTeacherInput) => {
    try {
      await createTeacher({ input: payload });
    } catch (createError) {
      toast({
        title: "Error",
        description: createError.message as string,
        variant: "destructive",
      });
    }
  };

  const archiveTeacher = async (id: number) => {
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

  const edit = async (payload: UpdateTeacherInput) => {
    try {
      await updateTeacher({ input: payload });
    } catch (updateError) {
      toast({
        title: "Error",
        description: updateError.message as string,
        variant: "destructive",
      });
    }
  };

  const { setIsDeleting, setIsEditing, setIsCreating } = useTeacherStore();

  const handleClickMenu = useCallback(
    (teacherId: string, action: string) => {
      if (action === "edit") setIsEditing(teacherId);
      else if (action === "archive") setIsDeleting(teacherId);
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
    (row: Teacher) => {
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
    archiveTeacher,
    archiveError,
    handleClose,
    createError,
    ellipsisConfig,
    handleClickMenu,
  };
}
