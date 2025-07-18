import {
  CreateSubjectInput,
  UpdateSubjectInput,
  useArchiveSubjectMutation,
  useCreateSubjectMutation,
  Subject,
  useUpdateSubjectMutation,
  useAssignClassTeacherMutation,
  AssignClassTeacherInput,
  useAssignSubjectsToClassMutation,
  AssignSubjectsToClassInput,
} from "@/generated/graphql";
import { SubjectID, useSubjectStore } from "@/stores/subject.store";
import { Pencil } from "lucide-react";
import { useCallback } from "react";
import { toast, useToast } from "./use-toast";
import { assign } from "lodash";

export function useSubjects() {
  const [{ fetching: createMutating, error: createError }, createSubject] =
    useCreateSubjectMutation();
  const [{ fetching: updateMutating, error: updateError }, updateSubject] =
    useUpdateSubjectMutation();
  // archive
  const [{ fetching: archiveMutating, error: archiveError }, archive] =
    useArchiveSubjectMutation();

  const [{ fetching: assignSubjectToClassMutating, error: assignSubjectToClassError }, assignSubjectsToClass] = useAssignSubjectsToClassMutation();

  const { toast } = useToast();

  const create = async (payload: CreateSubjectInput) => {
    try {
      const { error } = await createSubject({ input: payload });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subject created successfully",
          description: "Subject created successfully",
          variant: "default",
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

  const archiveSubject = async (id: number) => {
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
          title: "Subject archived successfully",
          description: "Subject archived successfully",
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

  const assignSubjects = async (payload: AssignSubjectsToClassInput) => {
    try {
      const { error } = await assignSubjectsToClass({ input: payload });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subjects assigned successfully",
          description: "Subjects assigned successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
        duration: 5000,
      });
    }
  };



  const edit = async (payload: UpdateSubjectInput) => {
    try {
      const { error } = await updateSubject({ input: payload });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subject updated successfully",
          description: "Subject updated successfully",
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

  const { setIsDeleting, setIsEditing, setIsCreating } = useSubjectStore();

  const handleClickMenu = useCallback(
    (subjectId: SubjectID, action: string) => {
      if (action === "edit") setIsEditing(subjectId);
      else if (action === "archive") setIsDeleting(subjectId);
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
    (row: Subject) => {
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
    assignSubjectToClassMutating,
    assignSubjects,
    assignSubjectToClassError,
    archiveSubject,
    archiveError,
    handleClose,
    createError,
    ellipsisConfig,
    handleClickMenu,

  };
}
