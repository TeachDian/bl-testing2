"use client";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { Typography } from "@/common/components/ui/Typography";
import {
  LucideBookOpen,
  LucideBookText,
  LucidePaintBucket,
  LucidePenLine,
  LucideSquareGantt,
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Spinner } from "@/common/components/ui/Spinner";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useUpdateGameFowlLegColor from "../hooks/useUpdateGameFowlLegColor";
import { T_Update_Game_Fowl_Leg_Color } from "@repo/contract";
import { Textarea } from "@/common/components/shadcn/ui/textarea";
import useGetGameFowlLegColorById from "../hooks/useGetGameFowlLegColorById";

// Utility function to capitalize the first letter of a string
const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const EditLegColor = () => {
  const params = useParams<{ legColorId: string }>();
  const legColorId = params.legColorId;
  const { mutateAsync: updateGender } = useUpdateGameFowlLegColor(legColorId);
  const { setValue, register, handleSubmit, watch } =
    useForm<T_Update_Game_Fowl_Leg_Color>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data, isPending } = useGetGameFowlLegColorById(legColorId);

  const legColorDetails = watch("legColorDetails", "");
  const maxDescriptionLength = 500;

  const onSubmit = async (formData: T_Update_Game_Fowl_Leg_Color) => {
    try {
      const modifiedFormData = {
        ...formData,
        legColorTitle: capitalizeFirstLetter(formData.legColorDetails),
        legColorDetails: capitalizeFirstLetter(formData.legColorDetails),
      };
      const response = await updateGender(modifiedFormData);
      console.log(response);
      if (!response.error) {
        toast.success(response.message);
        setTimeout(() => {
          router.push(`/admin/settings/gf-leg-color/view`);
        }, 1000);
      } else {
        toast.error(response.message || "An error occurred");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(String(err));
    }
  };

  useEffect(() => {
    if (!isPending && data?.item) {
      const item = data.item;
      setValue("legColorTitle", data.item.legColorTitle || " ");
      setValue("legColorDetails", data.item.legColorDetails || " ");
    }
  }, [data, isPending, setValue]);

  return (
    <WidthWrapper width="full">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex gap-2 items-center">
          <LucidePaintBucket />
          <Typography variant="h1" fontWeight="semiBold">
            Edit Game Fowl Leg Color
          </Typography>
        </div>
        <div className="border-2 shadow rounded-md sm:min-h-screen h-auto p-5 flex flex-col">
          <div className="flex gap-2 items-center">
            <LucideBookOpen />
            <Typography variant="h3" fontWeight="semiBold">
              Update game fowl leg color
            </Typography>
          </div>
          <div className="border-b py-2"></div>
          <div className="grid sm:grid-cols-12 pt-8 gap-6 flex-grow">
            <div className="items-stretch col-span-8 space-y-4 text-gray-600 flex flex-col">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 flex-grow flex flex-col justify-between"
              >
                <div>
                  <div className="sm:flex items-center mb-4 gap-2">
                    <LucidePenLine size={20} />
                    <Typography fontWeight="semiBold" className="w-48">
                      Leg color title
                    </Typography>
                    <Input
                      placeholder="Enter game fowl leg color"
                      required
                      {...register("legColorTitle", {
                        required: "You need to fill up this field",
                      })}
                      className="flex-1"
                    />
                  </div>

                  <div className="sm:flex items gap-2">
                    <LucidePenLine size={20} />
                    <Typography fontWeight="semiBold" className="w-48">
                      Leg color details
                    </Typography>
                    <div className="sm:w-80 w-full flex flex-col">
                      <Textarea
                        placeholder="Enter caption for activity"
                        style={{ width: "100%", height: "250px" }}
                        className="w-full text-justify"
                        maxLength={maxDescriptionLength}
                        {...register("legColorDetails", {
                          required: true,
                          maxLength: maxDescriptionLength,
                        })}
                      />
                      <div className="text-right text-sm text-gray-500">
                        {legColorDetails.length}/{maxDescriptionLength}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  className="mt-4 self-start w-32"
                  variant="default"
                  size="lg"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size="md" /> : "Update"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default EditLegColor;
