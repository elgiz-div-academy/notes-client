import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthApiHooks } from "@/store/api/auth.api";
import { SubmitHandler, useForm } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { useNavigate } from "@/router";

export default function LoginComponent() {
  const { login, isLoading } = AuthApiHooks.useLogin();

  const navigate = useNavigate();
  const { handleSubmit, register } = useForm({ mode: "onSubmit" });

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-8">
          <Spinner />
        </div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      await login(data);
      navigate("/notes");
    } catch (err: any) {
      if (err.message || err?.data?.message) {
        toast.dismiss();
        toast.error(err.message || err?.data?.message);
      }
    }
  };

  const onError = () => {
    toast.dismiss();
    toast.error("Username və ya şifrə yanlışdır");
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Notes App
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
          <div>
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-muted-foreground"
            >
              Username
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                className="block w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                {...register("username", { required: true, minLength: 3 })}
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground"
            >
              Şifrə
            </Label>
            <div className="mt-1">
              <Input
                type="password"
                {...register("password", { required: true })}
                className="block w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Giriş
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
