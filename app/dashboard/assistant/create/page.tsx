"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { createAssistantSchema } from "@/lib/validations/assistant";

import { CreateAssistantInput } from "@/lib/validations/assistant2";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadService } from "@/lib/supabase/upload";
import { useOpenAI } from "@/hooks/use-openai";

export default function page() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { uploadFiles } = uploadService();
  const {
    uploadToOpenAI,
    createVectorStore,
    updateVectorStore,
    createAssistant,
  } = useOpenAI();

  const form = useForm<CreateAssistantInput>({
    resolver: zodResolver(createAssistantSchema),
    defaultValues: {
      name: "",
      model: "",
      instructions: "",
      temperature: 0.7,
      files: [],
    },
  });

  // Handle file upload
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);

      // Update form with file metadata
      form.setValue(
        "files",
        acceptedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
      );
    },
    [form]
  );

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/json": [".json"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/assistant", label: "Assistants" },
    { label: "New Assistant", isCurrentPage: true },
  ];

  const handleFormSubmit = async (formData: CreateAssistantInput) => {
    if (uploadedFiles.length > 0) {
      // Upload files to Supabase
      const fileUrls = await uploadFiles(uploadedFiles);
      // Upload files to OpenAI
      let fileIds: string[] = [];
      if (fileUrls.success && fileUrls.data) {
        // Loop through fileUrls and then upload to OpenAI
        fileUrls.data?.forEach(async (fileUrl) => {
          const fileId = await uploadToOpenAI({
            file_url: fileUrl,
            file_name: fileUrl,
            file_type: "application/pdf",
          });
          if (fileId) {
            console.log("fileId", fileId);
            fileIds.push(fileId);
          }
        });
        // Create vector store
        const vectorId = await createVectorStore({ name: formData.name });
        // Add files to vector store
        if (vectorId) {
          await updateVectorStore({
            vector_store_id: vectorId,
            file_ids: fileIds,
          });
          // Create assistant with vector store
          const assistant = await createAssistant({
            name: formData.name,
            vector_store_id: vectorId,
            instructions: formData.instructions,
          });
        }
      }
    }
  };

  const getFilePreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Add cleanup for object URLs on component unmount
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      uploadedFiles.forEach((file) => {
        URL.revokeObjectURL(getFilePreviewUrl(file));
      });
    };
  }, [uploadedFiles]);
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="container max-w-2xl px-4 pt-4 pb-20 mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Create New Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure your new AI assistant with custom instructions and
              parameters.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6 pt-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assistant Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a name for your assistant"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is how you'll identify your assistant.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-4-turbo-preview">
                          GPT-4 Turbo
                        </SelectItem>
                        <SelectItem value="gpt-3.5-turbo">
                          GPT-3.5 Turbo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the AI model that powers your assistant.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed instructions for your assistant..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide clear instructions about how the assistant should
                      behave and respond.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Adjust creativity level (0 = more focused, 1 = more
                      creative)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="files"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Files (Optional)</FormLabel>
                    <FormControl>
                      <div
                        {...getRootProps()}
                        className={cn(
                          "border-2 border-dashed rounded-lg px-6 py-10 cursor-pointer",
                          "hover:border-primary/50 transition-colors",
                          isDragActive && "border-primary bg-primary/5"
                        )}
                      >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-2 text-center">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drag & drop or click to select files
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, TXT, MD, JSON (Max 20MB)
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.name}
                            className="flex items-center justify-between p-2 bg-muted rounded-md"
                          >
                            <a
                              href={getFilePreviewUrl(file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm truncate text-primary hover:underline"
                            >
                              {file.name}
                            </a>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                URL.revokeObjectURL(getFilePreviewUrl(file));
                                setUploadedFiles(
                                  uploadedFiles.filter((f) => f !== file)
                                );
                                const currentFiles =
                                  form.getValues("files") || [];
                                form.setValue(
                                  "files",
                                  currentFiles.filter(
                                    (f) => f.name !== file.name
                                  )
                                );
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormDescription>
                      Upload files to train your assistant with custom
                      knowledge.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 mt-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Assistant</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
