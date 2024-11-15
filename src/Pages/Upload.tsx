import React, { useContext, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/Components/ui/card";
import { UserContext } from "@/Utils/UserProvider";

export default function AddCar() {
  document.title = "Add New Car";
  const { toast } = useToast();
  const userContext = useContext(UserContext);
  const token = userContext?.token;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [tags, setTags] = useState<{ key: string; value: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTagChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "key" | "value"
  ) => {
    const updatedTags = [...tags];
    updatedTags[index] = {
      ...updatedTags[index],
      [type]: e.target.value,
    };
    setTags(updatedTags);
  };

  const addTag = () => {
    setTags((prevTags) => [...prevTags, { key: "", value: "" }]);
  };

  const removeTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(files.length > 10){
        toast({
            variant: "destructive",
            title: "Error",
            description: "You can only upload a maximum of 10 files.",
        });
        return;
    }
    setLoading(true);
    const carData = new FormData();
    carData.append("title", formData.title);
    carData.append("description", formData.description);
    carData.append("tags", JSON.stringify(tags));
    files.forEach((file) => carData.append("files", file));
    try {
      await axios.post(`${backendUrl}/cars`, carData, {
        headers: { "Content-Type": "multipart/form-data", authorization: token },
      });
      toast({
        variant: "default",
        title: "Success!",
        description: "Car added successfully.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
    <Card className="max-w-3xl mx-auto py-6 w-full p-3">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold">Add New Car</h1>

        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter car title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter car description"
            required
          />
        </div>

        {/* Dynamic Key-Value Tags */}
        <div>
          <Label>Tags (Key-Value Pairs)</Label>
          <div className="space-y-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={tag.key}
                  onChange={(e) => handleTagChange(e, index, "key")}
                  placeholder="Key"
                  required
                />
                <Input
                  value={tag.value}
                  onChange={(e) => handleTagChange(e, index, "value")}
                  placeholder="Value"
                  required
                />
                <Button variant="destructive" onClick={() => removeTag(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addTag}>
              Add Tag
            </Button>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <Label htmlFor="files">Upload Images</Label>
          <Input
            id="files"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding Car..." : "Add Car"}
        </Button>
      </form>
    </Card>
    </div>
  );
}
