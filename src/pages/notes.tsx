import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, Navigate } from "@/router";
import { HomeIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useUpdateNoteMutation,
} from "@/store/api/note.api";
import { Spinner } from "@/components/ui/spinner";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export default function NotesComponent() {
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{
    id: number;
    title: string;
    description: string;
  } | null>(null);

  const {
    data: notes,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useGetNotesQuery({}, { refetchOnFocus: true });

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const { register, handleSubmit } = useForm();

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    setValue,
  } = useForm();

  useEffect(() => {
    if (selectedNote) {
      for (let key in selectedNote) {
        setValue(key, (selectedNote as any)[key]);
      }
    }
  }, [selectedNote]);

  const deleteNoteHandler = async (id: any) => {
    try {
      setIsCreateNoteModalOpen(false);
      await deleteNote(id);
      toast.success("Not uğurla silindi");
      refetch();
    } catch (err: any) {
      if (err.message || err?.data?.message) {
        toast.dismiss();
        toast.error(err.message || err?.data?.message);
      }
    }
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      setIsCreateNoteModalOpen(false);
      await createNote(data);
      toast.success("Not uğurla əlavə edildi");
      refetch();
    } catch (err: any) {
      if (err.message || err?.data?.message) {
        toast.dismiss();
        toast.error(err.message || err?.data?.message);
      }
    }
  };

  const onUpdateSubmit: SubmitHandler<any> = async (data) => {
    try {
      setSelectedNote(null);
      await updateNote({ id: selectedNote?.id, ...data });
      toast.success("Not updated");
      refetch();
    } catch (err: any) {
      if (err.message || err?.data?.message) {
        toast.dismiss();
        toast.error(err.message || err?.data?.message);
      }
    }
  };

  const onError = (err: any) => {
    toast.dismiss();
    toast.error(err?.message || err?.data?.message);
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-8">
          <Spinner />
        </div>
      </div>
    );
  }
  if (isError && (error as any)?.status === 401) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen flex-col min-w-2.5">
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <HomeIcon className="h-6 w-6" />
          <span className="sr-only">Notes App</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <img
              src="/placeholder-user.jpg"
              width="32"
              height="32"
              className="rounded-full"
              alt="Avatar"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-col min-h-screen max-w-screen-md min-w-[620px] rounded-md px-0 mx-auto bg-background text-foreground">
        <div className="container mx-auto p-5">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Notes</h1>
            <Button onClick={() => setIsCreateNoteModalOpen(true)}>
              Yeni Not
            </Button>
          </div>

          <div className="container mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
            {!notes?.length && (
              <Card>
                <CardHeader>
                  <CardTitle>Not Tapılmadı</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yeni not əlavə edin...
                  </p>
                </CardContent>
              </Card>
            )}
            {notes?.map((note: any, index: any) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{note.description}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedNote(note);
                      }}
                    >
                      <Pencil2Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNoteHandler(note.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* <div className="text-xs text-muted-foreground">
                    2 days ago
                  </div> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Edit Not*/}
      <Dialog
        open={!!selectedNote}
        onOpenChange={(d) => setSelectedNote(d ? selectedNote : null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Not Redaktəsi</DialogTitle>
            <DialogDescription>notü güncəlləyin</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter note title"
                className="col-span-3"
                {...registerUpdate("title", {
                  required: true,
                  value: selectedNote?.title,
                })}
              />
            </div>
            <div className="grid items-start grid-cols-4 gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Enter note content"
                className="col-span-3 min-h-[150px]"
                {...registerUpdate("description", {
                  required: true,
                  value: selectedNote?.description,
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateSubmit(onUpdateSubmit, onError)}
            >
              Save
            </Button>
            <div>
              <Button variant="outline" onClick={() => setSelectedNote(null)}>
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Yeni not */}
      <Dialog
        open={isCreateNoteModalOpen}
        onOpenChange={setIsCreateNoteModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yeni not</DialogTitle>
            <DialogDescription>yeni not yaradın</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter note title"
                className="col-span-3"
                {...register("title", { required: true })}
              />
            </div>
            <div className="grid items-start grid-cols-4 gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Enter note content"
                className="col-span-3 min-h-[150px]"
                {...register("description", { required: true })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit(onSubmit, onError)}>
              Save Note
            </Button>
            <div>
              <Button
                variant="outline"
                onClick={() => setIsCreateNoteModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
