"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Mail, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authAPI } from "@/lib/api/config";
import { LoadingSpinner } from "@/components/loading";

type VerificationStatus = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authAPI.verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch (err: unknown) {
        setStatus("error");
        const errorMessage = err instanceof Error ? err.message : "Verification failed. The link may be expired or invalid.";
        setMessage(errorMessage);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-xl">
          <CardContent className="p-8">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center gap-2 mb-8">
              <div className="gradient-primary p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient">EventAura</span>
            </Link>

            {status === "loading" && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <LoadingSpinner size="lg" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Email</h1>
                <p className="text-muted-foreground">Please wait while we verify your email address...</p>
              </div>
            )}

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </motion.div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h1>
                <p className="text-muted-foreground mb-8">{message}</p>
                <div className="space-y-3">
                  <Button asChild className="w-full gradient-primary text-primary-foreground">
                    <Link href="/login">
                      Continue to Login
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">Go to Homepage</Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6"
                >
                  <XCircle className="h-10 w-10 text-red-500" />
                </motion.div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
                <p className="text-muted-foreground mb-8">{message}</p>
                <div className="space-y-3">
                  <Button asChild className="w-full gradient-primary text-primary-foreground">
                    <Link href="/login">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Request New Verification
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">Go to Homepage</Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Having trouble?{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
