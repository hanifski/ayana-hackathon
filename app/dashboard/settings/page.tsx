"use client";

import React, { useState } from "react";

// React & Next
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSupabase } from "@/hooks/use-supabase";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Validations
import { profileSchema, profileInput } from "@/lib/validations/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";

export default function SettingPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const { update } = useSupabase<any>("profiles");
    const router = useRouter();
    

    // Form
    const form = useForm<profileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
        name: "",
        email: "",
        role: "",
        country: "USA",
        timeZone: "UTC",
        bio: "",
        },
    });

    const handleSaveProfile = async () => {
      /*  try {
          const userId = "userId"; // Replace with actual user ID retrieval logic
          const profileData: Partial<profileInput> = {
            firstName: form.getValues("firstName"),
            lastName: form.getValues("lastName"),
            email: form.getValues("email"),
            role: form.getValues("role"),
            country: form.getValues("country"),
            timeZone: form.getValues("timeZone"),
            bio: form.getValues("bio"),
          });
          router.push("/dashboard");
        } catch (error) {
            console.error(“Error creating assistant:“, error);}
      };
      */
    }
    
  return (
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <form onSubmit={form.handleSubmit(handleSaveProfile)}>
        <div className="mx-auto max-w-7xl">
          <div className="space-y-10">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-semibold">Personal info</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update your photo and personal details here.
              </p>
            </div>
    
            {/* Form */}
            <div className="space-y-8">
              {/* Name */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="w-full sm:w-1/3">
                  <Label className="text-base font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    This is your public display name.
                  </p>
                </div>
                <div className="w-full sm:w-2/3 grid grid-cols-2 gap-4">
                <Input
                    {...form.register("name")}
                    type="text"
                    placeholder="Full Name"
                    disabled={loading}
                    className="h-12"/>

                
                {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
                </p>
                )}

                </div>
                </div>
                </div>
                </div>
                </div>
              </form>
              </div>
        );
    }
