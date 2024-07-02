import { useState, ChangeEvent, useRef, MutableRefObject } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Quill from "quill";
import Editor from "./editor";

const Delta = Quill.import('delta');

export function NewBug() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [impactLevel, setImpactLevel] = useState("medium");
  const [usersAffected, setUsersAffected] = useState("many");
  const [url, setUrl] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState<any>();
  const [readOnly, setReadOnly] = useState(false);

  const quillRef = useRef<Quill | null>(null);

  const onSubmit = async () => {
    const fileDetails = await Promise.all(attachments.map(file => getFileDetails(file)));
    console.log(fileDetails);
    // You can now send fileDetails to your backend if needed
  };

  const getFileDetails = (file: File) => {
    return new Promise<{ name: string; size: number; mimetype: string; data: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result?.toString().split(',')[1];
        resolve({
          name: file.name,
          size: file.size,
          mimetype: file.type,
          data: base64Data || ''
        });
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Report a Bug</CardTitle>
        <CardDescription>Help us improve by reporting any issues you encounter.</CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <Label htmlFor="rich-text">Steps to Reproduce</Label>
          <Editor
            ref={quillRef}
            readOnly={readOnly}
            defaultValue={new Delta()
              .insert('Hello')
              .insert('\n', { header: 1 })
              .insert('Some ')
              .insert('initial', { bold: true })
              .insert(' ')
              .insert('content', { underline: true })
              .insert('\n')}
            onSelectionChange={setRange}
            onTextChange={setLastChange}
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
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onSubmit}>Submit Bug Report</Button>
      </CardFooter>
    </Card>
  );
}
