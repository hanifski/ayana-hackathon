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
    try {
      const userId = "userId"; // Replace with actual user ID retrieval logic
      const profileData: Partial<profileInput> = {
        name: form.getValues("name"),
        email: form.getValues("email"),
        role: form.getValues("role"),
        country: form.getValues("country"),
        timeZone: form.getValues("timeZone"),
        bio: form.getValues("bio"),
      };

      router.push("/d");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error instanceof Error ? error.message : "Unknown error"
      ); // Use correct quotes and error message
    }
  };

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
              <div className="bg-slate-500 flex flex-col sm:flex-row gap-4">
                <div className="bg-yellow-300 w-full">
                  <Label className="text-base font-medium">Name</Label>
                </div>
                <div className="bg-purple-400 w-full flex flex-col">
                  <Input
                    {...form.register("name")}
                    type="text"
                    placeholder="Full Name"
                    disabled={loading}
                    className="h-12"
                  />

                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              {/* email */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-full">
                  <Label className="text-base font-medium">Email</Label>
                </div>
                <div className="w-full flex flex-col">
                  <Input
                    {...form.register("email")}
                    type="text"
                    placeholder="example@gmail.com"
                    disabled={loading}
                    className="h-12"
                  />

                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* role */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <Label className="text-base font-medium">Role</Label>
                </div>
                <div className="w-full flex flex-col">
                  <Input
                    {...form.register("role")}
                    type="text"
                    placeholder="web developer"
                    disabled={loading}
                    className="h-12"
                  />

                  {form.formState.errors.role && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* country */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <Label className="text-base font-medium">Country</Label>
                </div>
                <div className="w-full flex flex-col">
                  <select
                    {...form.register("country")}
                    disabled={loading}
                    className="h-12 w-full border rounded-md pl-2 pr-2"
                  >
                    <option value="" disabled>
                      Select your country
                    </option>
                    <option value="usa">United States</option>
                    <option value="canada">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="australia">Australia</option>
                    {/* Add more countries as needed */}
                  </select>

                  {form.formState.errors.country && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              {/* timezone */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <Label className="text-base font-medium">Timezone</Label>
                </div>
                <div className="w-full flex flex-col">
                  <select
                    {...form.register("timeZone")}
                    disabled={loading}
                    className="h-12 w-full border rounded-md pl-2 pr-2"
                  >
                    <option value="" disabled>
                      Select your timezone
                    </option>
                    <option value="utc">UTC</option>
                    <option value="gmt">GMT</option>
                    <option value="est">EST</option>
                    <option value="cst">CST</option>
                    <option value="pst">PST</option>
                    {/* Add more countries as needed */}
                  </select>

                  {form.formState.errors.timeZone && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.timeZone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* bio */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <Label className="text-base font-medium">Bio</Label>
                </div>
                <div className="w-full flex flex-col">
                  <Input
                    {...form.register("bio")}
                    type="text"
                    placeholder="i am a product designer for last 5 year"
                    disabled={loading}
                    className="h-12"
                  />

                  {form.formState.errors.bio && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="mt-4">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
