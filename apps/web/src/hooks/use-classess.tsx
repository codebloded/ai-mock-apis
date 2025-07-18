import {
  CreateClassesInput,
  UpdateClassesInput,
  useArchiveClassesMutation,
  useCreateClassesMutation,
  Classes,
  useUpdateClassesMutation,
  useAssignClassTeacherMutation,
  AssignClassTeacherInput,
} from "@/generated/graphql";
import { useClassesStore } from "@/stores/classes.store";
import { Pencil } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "./use-toast";

export function useClassess() {
  const [{ fetching: createMutating, error: createError }, createClasses] =
    useCreateClassesMutation();
  const [{ fetching: updateMutating, error: updateError }, updateClasses] =
    useUpdateClassesMutation();
  // archive
  const [{ fetching: archiveMutating, error: archiveError }, archive] =
    useArchiveClassesMutation();

  const [{ fetching: assignTeacherMutating, error: assignTeacherError }, assignTeacher] =
    useAssignClassTeacherMutation();

  const { toast } = useToast();

  const create = async (payload: CreateClassesInput) => {
    try {
      await createClasses({ input: payload });
    } catch (createError) {
      toast({
        title: "Error",
        description: createError.message as string,
        variant: "destructive",
      });
    }
  };

  const archiveClasses = async (id: number) => {
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

  const edit = async (payload: UpdateClassesInput) => {
    try {
      const { error } = await updateClasses({ input: payload });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    }
  };

  const assignClassTeacher = async (payload: AssignClassTeacherInput) => {
    try {
      const { error } = await assignTeacher({ input: payload });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    }
  };

  const { setIsDeleting, setIsEditing, setIsCreating } = useClassesStore();

  const handleClickMenu = useCallback(
    (classesId: string, action: string) => {
      if (action === "edit") setIsEditing(classesId);
      else if (action === "archive") setIsDeleting(classesId);
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
    (row: Classes) => {
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
    archiveClasses,
    archiveError,
    handleClose,
    createError,
    ellipsisConfig,
    handleClickMenu,
    assignTeacherMutating,
    assignTeacherError,
    assignClassTeacher,
  };
}
