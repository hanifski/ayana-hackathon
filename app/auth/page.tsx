"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSelector from "@/components/LanguageSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  signUpSchema,
  signUpInputs,
  loginSchema,
  loginInputs,
} from "@/lib/validation/auth";
import { signUpWithEmail, logout } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const form = useForm<signUpInputs>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "Hilmi",
      email: "check123@gmail.com",
      password: "1232131pass%%%",
    },
  });

  const handleSignUp = async (data: signUpInputs) => {
    try {
      logout();
      await signUpWithEmail(data);
      router.push("/d");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="h-screen flex flex-col justify-between bg-background">
      {/* Header */}
      <header className="p-8 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-foreground">Ayana Wedding</h1>
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <div className="w-full h-full p-12 flex flex-col ">
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-2">
            Magical Moments in an enchanting atmosphere
          </p>
          <h2 className="text-4xl font-bold text-foreground">Weddings</h2>
        </div>

        <div
          className="flex bg-muted
        "
        >
          {/* Left side - Image */}

          <div className="relative h-[400px] w-full">
            <Image
              src="/assets/wedding-illustration.jpg"
              alt="Wedding scene with bride"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right side - Login Form */}
          <div className="space-y-6 w-full p-8">
            <div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">
                Ayana Wedding Videos Collections.
              </h3>
            </div>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSignUp)}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    Full Name
                  </label>
                  <Input
                    {...form.register("full_name")}
                    type="text"
                    id="full_name"
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    Email
                  </label>
                  <Input
                    {...form.register("email")}
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    Password
                  </label>
                  <Input
                    {...form.register("password")}
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    className="w-full"
                  />
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                variant="default"
                type="submit"
              >
                Sign Up
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-4 mb-4 md:mb-0">
              <span>BALI</span>
              <span>KOMODO</span>
              <span>JAKARTA</span>
              <span>CRUISE</span>
            </div>
            <Image
              src="/ayana-logo.png"
              alt="AYANA Logo"
              width={120}
              height={40}
              className="mb-4 md:mb-0"
            />
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Careers</span>
              <span>Pressroom</span>
              <span>© AYANA</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
