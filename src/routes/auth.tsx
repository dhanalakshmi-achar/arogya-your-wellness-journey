// // import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
// // import { useEffect, useState } from "react";
// // import { z } from "zod";
// // import { motion } from "framer-motion";
// // import { Heart, Mail, Lock, Loader2 } from "lucide-react";
// // import { supabase } from "@/integrations/supabase/client";
// // import { lovable } from "@/integrations/lovable/index";
// // import { toast } from "sonner";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";

// // const searchSchema = z.object({ mode: z.enum(["signin", "signup"]).optional() });

// // export const Route = createFileRoute("/auth")({
// //   validateSearch: (s) => searchSchema.parse(s),
// //   head: () => ({
// //     meta: [
// //       { title: "Sign in to Arogya" },
// //       { name: "description", content: "Sign in or create your Arogya account to start your wellness journey." },
// //       { property: "og:title", content: "Sign in — Arogya" },
// //       { property: "og:description", content: "Continue your holistic health journey with Arogya." },
// //     ],
// //   }),
// //   component: AuthPage,
// // });

// // function AuthPage() {
// //   const navigate = useNavigate();
// //   const { mode: initial } = Route.useSearch();
// //   const [mode, setMode] = useState<"signin" | "signup">(initial ?? "signin");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [name, setName] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     supabase.auth.getSession().then(({ data }) => {
// //       if (data.session) navigate({ to: "/dashboard", replace: true });
// //     });
// //   }, [navigate]);

// //   const submit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     try {
// //       if (mode === "signup") {
// //         const { error } = await supabase.auth.signUp({
// //           email,
// //           password,
// //           options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: name } },
// //         });
// //         if (error) throw error;
// //         toast.success("Welcome! Check your email if confirmation is required.");
// //         navigate({ to: "/onboarding" });
// //       } else {
// //         const { error } = await supabase.auth.signInWithPassword({ email, password });
// //         if (error) throw error;
// //         toast.success("Welcome back!");
// //         navigate({ to: "/dashboard" });
// //       }
// //     } catch (err) {
// //       toast.error(err instanceof Error ? err.message : "Something went wrong");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const google = async () => {
// //     setLoading(true);
// //     try {
// //       // const result = await lovable.auth.signInWithOAuth("google", {
// //       //   redirect_uri: window.location.origin,
// //       // });
// //       const google = async () => {
// //   setLoading(true);

// //   try {
// //     const { error } = await supabase.auth.signInWithOAuth({
// //       provider: "google",
// //       options: {
// //         redirectTo: `${window.location.origin}/dashboard`,
// //       },
// //     });

// //     if (error) throw error;
// //   } catch (err) {
// //     toast.error(
// //       err instanceof Error ? err.message : "Google sign-in failed"
// //     );
// //     setLoading(false);
// //   }
// // };
// //       if (result.error) throw result.error instanceof Error ? result.error : new Error(String(result.error));
// //       if (result.redirected) return;
// //       navigate({ to: "/dashboard" });
// //     } catch (err) {
// //       toast.error(err instanceof Error ? err.message : "Google sign-in failed");
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="grid min-h-dvh md:grid-cols-2">
// //       <div className="hidden md:block relative overflow-hidden gradient-hero">
// //         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 0.5px, transparent 1px)", backgroundSize: "24px 24px" }} />
// //         <div className="relative flex h-full flex-col justify-between p-10 text-white">
// //           <Link to="/" className="flex items-center gap-2">
// //             <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 backdrop-blur">
// //               <Heart className="h-5 w-5" />
// //             </div>
// //             <span className="font-heading text-xl font-bold">Arogya</span>
// //           </Link>
// //           <div>
// //             <div className="max-w-md">
// //               <h2 className="font-heading text-3xl font-bold leading-tight">
// //                 "The greatest wealth is health."
// //               </h2>
// //               <p className="mt-3 text-white/80">Small daily habits, guided by a coach that gets you.</p>
// //             </div>
// //           </div>
// //           <div className="text-xs text-white/70">© {new Date().getFullYear()} Arogya</div>
// //         </div>
// //       </div>

// //       <div className="flex items-center justify-center px-5 py-10">
// //         <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
// //           <div className="mb-6 md:hidden">
// //             <Link to="/" className="inline-flex items-center gap-2">
// //               <div className="grid h-9 w-9 place-items-center rounded-2xl gradient-hero text-white">
// //                 <Heart className="h-4 w-4" />
// //               </div>
// //               <span className="font-heading text-lg font-bold">Arogya</span>
// //             </Link>
// //           </div>

// //           <h1 className="font-heading text-3xl font-bold tracking-tight">
// //             {mode === "signin" ? "Welcome back" : "Create your account"}
// //           </h1>
// //           <p className="mt-1 text-sm text-muted-foreground">
// //             {mode === "signin" ? "Sign in to continue your journey." : "Start your holistic wellness journey."}
// //           </p>

// //           <Button variant="outline" className="mt-6 w-full rounded-2xl" onClick={google} disabled={loading}>
// //             <GoogleIcon className="mr-2 h-4 w-4" /> Continue with Google
// //           </Button>

// //           <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
// //             <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
// //           </div>

// //           <form className="space-y-3" onSubmit={submit}>
// //             {mode === "signup" && (
// //               <div>
// //                 <Label htmlFor="name">Name</Label>
// //                 <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="mt-1 rounded-2xl" />
// //               </div>
// //             )}
// //             <div>
// //               <Label htmlFor="email">Email</Label>
// //               <div className="relative mt-1">
// //                 <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //                 <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="rounded-2xl pl-9" />
// //               </div>
// //             </div>
// //             <div>
// //               <Label htmlFor="password">Password</Label>
// //               <div className="relative mt-1">
// //                 <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //                 <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="rounded-2xl pl-9" />
// //               </div>
// //             </div>
// //             <Button type="submit" disabled={loading} className="w-full rounded-2xl shadow-glow">
// //               {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
// //               {mode === "signin" ? "Sign in" : "Create account"}
// //             </Button>
// //           </form>

// //           <div className="mt-5 text-center text-sm text-muted-foreground">
// //             {mode === "signin" ? (
// //               <>
// //                 Don't have an account?{" "}
// //                 <button className="font-semibold text-primary" onClick={() => setMode("signup")}>
// //                   Sign up
// //                 </button>
// //               </>
// //             ) : (
// //               <>
// //                 Already have an account?{" "}
// //                 <button className="font-semibold text-primary" onClick={() => setMode("signin")}>
// //                   Sign in
// //                 </button>
// //               </>
// //             )}
// //           </div>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // }

// // function GoogleIcon({ className }: { className?: string }) {
// //   return (
// //     <svg className={className} viewBox="0 0 24 24" aria-hidden>
// //       <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.3 14.7 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 12S6.9 21.6 12 21.6c6.9 0 9.3-4.8 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z" />
// //     </svg>
// //   );
// // }

// import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
// import { useEffect, useState } from "react";
// import { z } from "zod";
// import { motion } from "framer-motion";
// import { Heart, Mail, Lock, Loader2 } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const searchSchema = z.object({
//   mode: z.enum(["signin", "signup"]).optional(),
// });

// export const Route = createFileRoute("/auth")({
//   validateSearch: (s) => searchSchema.parse(s),

//   head: () => ({
//     meta: [
//       { title: "Sign in to Arogya" },
//       {
//         name: "description",
//         content:
//           "Sign in or create your Arogya account to start your wellness journey.",
//       },
//       {
//         property: "og:title",
//         content: "Sign in — Arogya",
//       },
//       {
//         property: "og:description",
//         content: "Continue your holistic health journey with Arogya.",
//       },
//     ],
//   }),

//   component: AuthPage,
// });

// function AuthPage() {
//   const navigate = useNavigate();
//   const { mode: initial } = Route.useSearch();

//   const [mode, setMode] = useState<"signin" | "signup">(
//     initial ?? "signin",
//   );
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       if (data.session) {
//         navigate({ to: "/dashboard", replace: true });
//       }
//     });
//   }, [navigate]);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (mode === "signup") {
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             emailRedirectTo: `${window.location.origin}/dashboard`,
//             data: {
//               full_name: name,
//             },
//           },
//         });

//         if (error) throw error;

//         toast.success(
//           "Welcome! Check your email if confirmation is required.",
//         );

//         navigate({ to: "/onboarding" });
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });

//         if (error) throw error;

//         toast.success("Welcome back!");
//         navigate({ to: "/dashboard" });
//       }
//     } catch (err) {
//       toast.error(
//         err instanceof Error ? err.message : "Something went wrong",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /*
//    * Google Sign-In
//    *
//    * This uses Supabase directly instead of the Lovable OAuth broker.
//    */
//   const google = async () => {
//     setLoading(true);

//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${window.location.origin}/dashboard`,
//         },
//       });

//       if (error) throw error;
//     } catch (err) {
//       toast.error(
//         err instanceof Error ? err.message : "Google sign-in failed",
//       );
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* Background */}
//       <div
//         className="absolute inset-0 opacity-20"
//         style={{
//           backgroundImage:
//             "radial-gradient(circle at 20% 30%, white 0.5px, transparent 1px)",
//           backgroundSize: "24px 24px",
//         }}
//       />

//       <div className="relative grid min-h-screen md:grid-cols-2">
//         {/* Left side */}
//         <div className="hidden flex-col justify-between p-10 md:flex">
//           <Link to="/" className="inline-flex items-center gap-2">
//             <div className="grid h-10 w-10 place-items-center rounded-2xl gradient-hero text-white">
//               <Heart className="h-5 w-5" />
//             </div>

//             <span className="font-heading text-xl font-bold">Arogya</span>
//           </Link>

//           <div className="max-w-md">
//             <h2 className="font-heading text-4xl font-bold leading-tight">
//               Your health.
//               <br />
//               Your journey.
//             </h2>

//             <p className="mt-4 text-muted-foreground">
//               "The greatest wealth is health."
//             </p>
//           </div>

//           <p className="text-sm text-muted-foreground">
//             © {new Date().getFullYear()} Arogya
//           </p>
//         </div>

//         {/* Right side */}
//         <div className="flex items-center justify-center px-5 py-10">
//           <motion.div
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="w-full max-w-sm"
//           >
//             {/* Mobile logo */}
//             <div className="mb-6 md:hidden">
//               <Link to="/" className="inline-flex items-center gap-2">
//                 <div className="grid h-9 w-9 place-items-center rounded-2xl gradient-hero text-white">
//                   <Heart className="h-4 w-4" />
//                 </div>

//                 <span className="font-heading text-lg font-bold">
//                   Arogya
//                 </span>
//               </Link>
//             </div>

//             <h1 className="font-heading text-3xl font-bold tracking-tight">
//               {mode === "signin"
//                 ? "Welcome back"
//                 : "Create your account"}
//             </h1>

//             <p className="mt-1 text-sm text-muted-foreground">
//               {mode === "signin"
//                 ? "Sign in to continue your journey."
//                 : "Start your holistic wellness journey."}
//             </p>

//             {/* Google */}
//             <Button
//               variant="outline"
//               className="mt-6 w-full rounded-2xl"
//               onClick={google}
//               disabled={loading}
//               type="button"
//             >
//               <GoogleIcon className="mr-2 h-4 w-4" />
//               Continue with Google
//             </Button>

//             {/* Divider */}
//             <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
//               <div className="h-px flex-1 bg-border" />
//               or
//               <div className="h-px flex-1 bg-border" />
//             </div>

//             {/* Email/password form */}
//             <form className="space-y-3" onSubmit={submit}>
//               {mode === "signup" && (
//                 <div>
//                   <Label htmlFor="name">Name</Label>

//                   <Input
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Your name"
//                     required
//                     className="mt-1 rounded-2xl"
//                   />
//                 </div>
//               )}

//               {/* Email */}
//               <div>
//                 <Label htmlFor="email">Email</Label>

//                 <div className="relative mt-1">
//                   <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//                   <Input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="you@example.com"
//                     required
//                     className="rounded-2xl pl-9"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <Label htmlFor="password">Password</Label>

//                 <div className="relative mt-1">
//                   <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//                   <Input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="••••••••"
//                     required
//                     minLength={6}
//                     className="rounded-2xl pl-9"
//                   />
//                 </div>
//               </div>

//               {/* Submit */}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-2xl shadow-glow"
//               >
//                 {loading ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : null}

//                 {mode === "signin"
//                   ? "Sign in"
//                   : "Create account"}
//               </Button>
//             </form>

//             {/* Switch signin/signup */}
//             <div className="mt-5 text-center text-sm text-muted-foreground">
//               {mode === "signin" ? (
//                 <>
//                   Don't have an account?{" "}
//                   <button
//                     type="button"
//                     className="font-semibold text-primary"
//                     onClick={() => setMode("signup")}
//                   >
//                     Sign up
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   Already have an account?{" "}
//                   <button
//                     type="button"
//                     className="font-semibold text-primary"
//                     onClick={() => setMode("signin")}
//                   >
//                     Sign in
//                   </button>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function GoogleIcon({ className }: { className?: string }) {
//   return (
//     <svg
//       className={className}
//       viewBox="0 0 24 24"
//       aria-hidden="true"
//     >
//       <path
//         fill="#4285F4"
//         d="M21.35 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.38Z"
//       />
//       <path
//         fill="#34A853"
//         d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.04H3.29v2.52A9.75 9.75 0 0 0 12 21.6Z"
//       />
//       <path
//         fill="#FBBC05"
//         d="M6.53 13.68A5.86 5.86 0 0 1 6.23 12c0-.58.1-1.15.3-1.68V7.8H3.29A9.76 9.76 0 0 0 2.25 12c0 1.58.38 3.08 1.04 4.2l3.24-2.52Z"
//       />
//       <path
//         fill="#EA4335"
//         d="M12 6.28c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.34 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.71 5.4l3.24 2.52C7.3 8 9.46 6.28 12 6.28Z"
//       />
//     </svg>
//   );
// }

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),

  head: () => ({
    meta: [
      {
        title: "Sign in to Arogya",
      },
      {
        name: "description",
        content:
          "Sign in or create your Arogya account to start your wellness journey.",
      },
      {
        property: "og:title",
        content: "Sign in — Arogya",
      },
      {
        property: "og:description",
        content: "Continue your holistic health journey with Arogya.",
      },
    ],
  }),

  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { mode: initial } = Route.useSearch();

  const [mode, setMode] = useState<"signin" | "signup">(
    initial ?? "signin",
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Check existing session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({
          to: "/dashboard",
          replace: true,
        });
      }
    });
  }, [navigate]);

  // Email / Password authentication
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: name,
            },
          },
        });

        if (error) {
          throw error;
        }

        toast.success(
          "Welcome! Check your email if confirmation is required.",
        );

        navigate({
          to: "/onboarding",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        toast.success("Welcome back!");

        navigate({
          to: "/dashboard",
        });
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  // Uses Supabase directly — NOT the Lovable OAuth broker.
  const google = async () => {
    setLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });

      if (error) {
        throw error;
      }

      // Supabase redirects the browser to Google automatically.
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Google sign-in failed",
      );

      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 0.5px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative grid min-h-screen md:grid-cols-2">

        {/* ========================= */}
        {/* LEFT SIDE */}
        {/* ========================= */}

        <div className="hidden flex-col justify-between p-10 md:flex">

          {/* Arogya Logo */}
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-3"
          >
            <img
              src="/arogya.png"
              alt="Arogya"
              className="h-12 w-12 rounded-2xl object-contain"
            />

            <span className="font-heading text-xl font-bold">
              Arogya
            </span>
          </Link>

          {/* Hero Text */}
          <div className="max-w-md">
            <h2 className="font-heading text-4xl font-bold leading-tight">
              Your health.
              <br />
              Your journey.
            </h2>

            <p className="mt-4 text-muted-foreground">
              "The greatest wealth is health."
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              Small daily habits, guided by a coach that gets you.
            </p>
          </div>

          {/* Footer */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Arogya
          </p>
        </div>

        {/* ========================= */}
        {/* RIGHT SIDE */}
        {/* ========================= */}

        <div className="flex items-center justify-center px-5 py-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="w-full max-w-sm"
          >

            {/* Mobile Logo */}
            <div className="mb-6 md:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <img
                  src="/arogya.png"
                  alt="Arogya"
                  className="h-10 w-10 rounded-xl object-contain"
                />

                <span className="font-heading text-lg font-bold">
                  Arogya
                </span>
              </Link>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {mode === "signin"
                ? "Welcome back"
                : "Create your account"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to continue your journey."
                : "Start your holistic wellness journey."}
            </p>

            {/* ========================= */}
            {/* GOOGLE BUTTON */}
            {/* ========================= */}

            <Button
              variant="outline"
              className="mt-6 w-full rounded-2xl"
              onClick={google}
              disabled={loading}
              type="button"
            >
              <GoogleIcon className="mr-2 h-4 w-4" />

              Continue with Google
            </Button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />

              <span>or</span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* ========================= */}
            {/* EMAIL / PASSWORD */}
            {/* ========================= */}

            <form
              className="space-y-3"
              onSubmit={submit}
            >

              {/* Name */}
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">
                    Name
                  </Label>

                  <Input
                    id="name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Your name"
                    required
                    className="mt-1 rounded-2xl"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <Label htmlFor="email">
                  Email
                </Label>

                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    className="rounded-2xl pl-9"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="rounded-2xl pl-9"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl shadow-glow"
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {mode === "signin"
                  ? "Sign in"
                  : "Create account"}
              </Button>
            </form>

            {/* ========================= */}
            {/* SWITCH SIGN IN / SIGN UP */}
            {/* ========================= */}

            <div className="mt-5 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}

                  <button
                    type="button"
                    className="font-semibold text-primary"
                    onClick={() =>
                      setMode("signup")
                    }
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}

                  <button
                    type="button"
                    className="font-semibold text-primary"
                    onClick={() =>
                      setMode("signin")
                    }
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ========================= */
/* GOOGLE ICON */
/* ========================= */

function GoogleIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.71-.06-1.39-.18-2.04H12v3.86h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.18Z"
      />

      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.75 9.75 0 0 0 12 21.5Z"
      />

      <path
        fill="#FBBC05"
        d="M6.54 13.61a5.86 5.86 0 0 1 0-3.22V7.89H3.3a9.75 9.75 0 0 0 0 8.22l3.24-2.5Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.36c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.43 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.39l3.24 2.5C7.31 8.08 9.46 6.36 12 6.36Z"
      />
    </svg>
  );
}