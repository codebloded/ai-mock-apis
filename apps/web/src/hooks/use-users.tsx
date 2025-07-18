import {
  CreateUserInput,
  UpdateUserInput,
  useArchiveUserMutation,
  useCreateUserMutation,
  User,
  useUpdateUserMutation,
} from "@/generated/graphql";
import { useUserStore } from "@/stores";
import { Pencil } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "./use-toast";

export function useUsers() {
  const [{ fetching: createMutating, error: createError }, createUser] =
    useCreateUserMutation();
  const [{ fetching: updateMutating, error: updateError }, updateUser] =
    useUpdateUserMutation();
  // archive
  const [{ fetching: archiveMutating, error: archiveError }, archive] =
    useArchiveUserMutation();

  const { toast } = useToast();

  const create = async (payload: CreateUserInput) => {
    try {
      const { error } = await createUser({ input: payload });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "User created successfully",
          description: "User created successfully",
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

  const archiveUser = async (id: number) => {
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
          title: "User archived successfully",
          description: "User archived successfully",
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

  const edit = async (payload: UpdateUserInput) => {
    try {
      const { error } = await updateUser({ input: payload });
      if (error) {
        toast({
          title: "Error",
          description: error.message as string,
          variant: "destructive",
        });
      } else {
        toast({
          title: "User updated successfully",
          description: "User updated successfully",
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

  const setIsDeleting = useUserStore((state) => state.setIsDeleting);
  const setIsEditing = useUserStore((state) => state.setIsEditing);
  const setIsCreating = useUserStore((state) => state.setIsCreating);

  const handleClickMenu = useCallback(
    (userId: string, action: string) => {
      console.log('handleClickMenu called with:', userId, action);
      if (action === "edit") {
        console.log('Setting isEditing to:', userId);
        setIsEditing(userId);
      }
      else if (action === "archive") setIsDeleting(userId);
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
    (row: User) => {
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
    archiveUser,
    archiveError,
    handleClose,
    createError,
    ellipsisConfig,
    handleClickMenu,
  };
}
