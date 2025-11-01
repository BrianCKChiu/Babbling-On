import { useEffect, useRef, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../dialog";
import { Input } from "../input";
import Image from "next/image";
import { Button } from "../button";
import { toast } from "../use-toast";
import { lessonStore } from "@/components/stores/lessonStore";
import uuid62 from "@/components/utils/uuid62";
import { auth, uploadFile } from "@/components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { HttpHandler } from "@/components/api/httpHandler";
import { DialogClose } from "@radix-ui/react-dialog";

export function NewSignModalContent({
  onClose = () => {},
}: {
  onClose?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [signId, setSignId] = useState<string>("");
  const [user] = useAuthState(auth);
  const { addSign, lessonId } = lessonStore();

  useEffect(() => {
    if (inputRef.current == null) return;
    inputRef.current.addEventListener("change", displayUploadedMedia);

    return () => {
      removeEventListener("change", displayUploadedMedia);
    };
  }, []);

  useEffect(() => {
    if (lessonId == null || lessonId === "") return;
    if (user == null) return;
    if (signId !== "") return;
    createInitialSign();
  }, [lessonId]);

  function displayUploadedMedia() {
    if (inputRef.current?.files == null) return;
    const file = inputRef.current.files[0];

    if (file == null) return;
    const imageURL = URL.createObjectURL(file);
    setMediaUrl(imageURL);
  }

  async function createInitialSign() {
    if (user == null) return;
    if (lessonId == null) return;

    const token = await user.getIdToken();

    await HttpHandler.post("/gesture/post", token, {
      token: token,
      phrase: "",
      verified: false,
      topicId: "1",
      lessonId: lessonId,
    })
      .then(async (res) => {
        const json = await res.json();
        setSignId(json.id);
      })
      .catch((e) => {
        console.error(e);
      });
  }
  function onSubmit() {
    if (user == null) return;
    if (inputRef.current?.files == null) return;
    const file = inputRef.current.files[0];
    if (file == null) {
      return toast({
        variant: "destructive",
        title: "Please upload an image",
        duration: 1000,
      });
    }
    if (file.size > 5000000) {
      return toast({
        variant: "destructive",
        title: "Image size must be less than 5MB",
        duration: 1000,
      });
    }
    if (description === "") {
      return toast({
        variant: "destructive",
        title: "Please enter a description",
        duration: 1000,
      });
    }
    const id = uuid62();
    // todo: upload image to firebase storage
    uploadFile(file, id, "images").then(async (url) => {
      const token = await user.getIdToken();

      HttpHandler.patch("/gesture/update/", signId, token, {
        mediaRef: url.ref.fullPath,
        phrase: description,
      });

      addSign({
        id: signId,
        title: description,
        imageUrl: url.ref.fullPath,
      });

      toast({
        title: "Sign Added",
        duration: 1000,
      });
      onClose();
    });
  }
  return (
    <DialogContent className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
      <DialogHeader>
        <DialogTitle>Add Sign</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col space-y-4">
        <div>
          <label>Description:</label>
          <Input
            type="text"
            value={description}
            onChange={(v) => setDescription(v.target.value)}
          />
        </div>

        <div>
          <label>Image:</label>

          <div className="w-96 h-96 border border-dashed group">
            {mediaUrl !== "" ? (
              <>
                <Image
                  src={mediaUrl}
                  alt=""
                  width={384}
                  height={384}
                  className="-z-10 absolute"
                />
                <div className="hidden absolute -z-10 bg-transparent group-hover:flex items-center w-96 h-96 ">
                  <div className="flex-1 text-center select-none ">
                    <span className="bg-white p-3 rounded-md">
                      Change Image
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="-z-10 bg-transparent absolute flex items-center w-96 h-96 ">
                <span className="flex-1 text-center select-none">
                  Upload Image
                </span>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              ref={inputRef}
              className="z-10 text-transparent file:hidden w-full h-full border-none bg-transparent hover:cursor-pointer group-hover:bg-gray-200 group-hover:bg-opacity-30"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={onSubmit}>
              Create Sign
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  );
}
