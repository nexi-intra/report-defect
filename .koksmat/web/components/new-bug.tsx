"use client";
import {
  useState,
  ChangeEvent,
  useRef,
  MutableRefObject,
  useEffect,
} from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

//import Editor from "./editor";

// import Quill, {
//   QuillOptionsStatic,
//   DeltaStatic,
//   RangeStatic,
//   BoundsStatic,
//   StringMap,
//   Sources,
// } from "quill";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

export function NewBug(props: { onSubmit?: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [impactLevel, setImpactLevel] = useState("");
  const [usersAffected, setUsersAffected] = useState("");
  const [url, setUrl] = useState("");
  const [details, setdetails] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }],
      ["code-block"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "code-block",
  ];

  //const quillRef = useRef<Quill | null>(null);

  const [valid, setvalid] = useState(false);

  const [reportData, setreportData] = useState<any>();

  const validate = () => {
    if (!title) return false;
    return true;
  };
  useEffect(() => {
    const isValid = validate();
    setvalid(isValid);
  }, [title]);

  const onSubmit = async () => {
    const files = await Promise.all(
      attachments.map((file) => getFileDetails(file))
    );
    console.log(files);
    const data = {
      title,
      impactLevel,
      usersAffected,
      url,
      details,
      fileDetails: files,
    };
    setreportData(data);
    if (props.onSubmit) {
      props.onSubmit(data);
    }
    // You can now send fileDetails to your backend if needed
  };

  const getFileDetails = (file: File) => {
    return new Promise<{
      name: string;
      size: number;
      mimetype: string;
      data: string;
    }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result?.toString().split(",")[1];
        resolve({
          name: file.name,
          size: file.size,
          mimetype: file.type,
          data: base64Data || "",
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };
  const handleEditorChange = (
    value: string,
    delta: any,
    source: any,
    editor: any
  ) => {
    setdetails(value);
  };
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Report a Bug</CardTitle>
        <CardDescription>
          Help us improve by reporting any issues you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a brief title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="impact-level">Impact Level</Label>
            <Select value={impactLevel} onValueChange={setImpactLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select impact level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="n.a.">Don&apos;t know</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="users-affected">Users Affected</Label>
            <Select value={usersAffected} onValueChange={setUsersAffected}>
              <SelectTrigger>
                <SelectValue placeholder="Select users affected" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="many">Many</SelectItem>
                <SelectItem value="few">Few</SelectItem>
                <SelectItem value="n.a.">Don&apos;t know</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            placeholder="Enter the URL where the issue occurred"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attachments">Attachments</Label>
          <input
            id="attachments"
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <div className="space-y-2 min-h-[30vh]">
          <Label htmlFor="rich-text">Detailed description</Label>
          <QuillEditor
            // value={content}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            className="w-full h-[70%] mt-10 bg-white"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button disabled={!valid} onClick={onSubmit}>
          Submit Bug Report
        </Button>
      </CardFooter>
    </Card>
  );
}
