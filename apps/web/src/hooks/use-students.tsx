import {
  CreateStudentInput,
  UpdateStudentInput,
  useArchiveStudentMutation,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  ExtendedStudent,
} from "@/generated/graphql";
import { useStudentStore } from "@/stores";
import { Pencil } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "./use-toast";

export function useStudents() {
  const [{ fetching: createMutating, error: createError }, createStudent] =
    useCreateStudentMutation();
  const [{ fetching: updateMutating, error: updateError }, updateStudent] =
    useUpdateStudentMutation();

  const [{ fetching: archiveMutating, error: archiveError }, archive] =
    useArchiveStudentMutation();

  const { toast } = useToast();

  const create = async (payload: CreateStudentInput) => {
    try {
      const { error } = await createStudent({ input: payload });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Student created successfully",
          description: "Student created successfully",
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

  const archiveStudent = async (id: number) => {
    try {
      const { error } = await archive({ id });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Student archived successfully",
          description: "Student archived successfully",
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

  const edit = async (payload: UpdateStudentInput) => {
    try {
      const { error } = await updateStudent({ input: payload });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Student updated successfully",
          description: "Student updated successfully",
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
  const setIsDeletingStudent = useStudentStore((state) => state.setIsDeleting);
  const setIsEditingStudent = useStudentStore((state) => state.setIsEditing);
  const setIsCreatingStudent = useStudentStore((state) => state.setIsCreating);

  const handleClickMenu = useCallback(
    (studentId: string, action: string) => {
      if (action === "edit") setIsEditingStudent(studentId);
      else if (action === "archive") setIsDeletingStudent(studentId);
    },
    [setIsEditingStudent, setIsDeletingStudent]
  );

  const handleClose = useCallback(() => {
    setIsCreatingStudent(null);
    setIsEditingStudent(null);
    setIsDeletingStudent(null);
  }, []);

  const ellipsisConfig = useCallback(
    (row: ExtendedStudent) => {
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
            console.log(row);
            handleClickMenu(row?.id, "edit");
          },
          icon: <Pencil size={15} />,
          disabled: false,
        },
        {
          name: "Archive",
          onClick: () => {
            handleClickMenu(row?.id, "archive");
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
    archiveStudent,
    archiveError,
    handleClose,
    createError,
    ellipsisConfig,
    handleClickMenu,
  };
}
