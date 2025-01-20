// app/login/page.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Facebook, Instagram, ChevronRight } from "lucide-react"
import { z } from "zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "../../store/store.js"
import { loginUser } from "../../services/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import "@/styles/globals.css"

interface SocialButtonProps {
  Icon: React.ComponentType<{ className?: string }>
  text: string
  gradient: string
  className?: string
}

export function SocialButton({ Icon, text, gradient, className }: SocialButtonProps) {
  return (
    <button
      className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg ${gradient} ${className}`}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className="hidden sm:inline">{text}</span>
    </button>
  )
}

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  motDePasse: z
    .string()
    .min(8, "Mot de passe : 8 caractères minimum")
    .regex(/[A-Z]/, "Doit contenir au moins une lettre majuscule")
    .regex(/[a-z]/, "Doit contenir au moins une lettre minuscule")
    .regex(/\d/, "Doit contenir au moins un chiffre")
    .regex(/[@$!%*?&#]/, "Doit contenir au moins un caractère spécial"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showmotDePasse, setShowmotDePasse] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const handleLogin: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true)
    try {
      const response = await loginUser(data.email, data.motDePasse)

      if (!response || !response.token || !response.user) {
        throw new Error("Erreur inconnue")
      }

      const token = response.token
      localStorage.setItem("token", token)

      setIsAuthenticated(true)
      setUser(response.user)

      router.push("/")
    } catch (error: unknown) {
      console.error("Erreur lors de la connexion:", error)
      if (error instanceof Error) {
        alert(`Connexion échouée : ${error.message}`)
      } else {
        alert("Connexion échouée : Erreur inconnue")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left section with wave design */}
          <div className="relative w-full md:w-1/2 bg-gradient-to-b from-blue-600 to-purple-700 text-white p-12 flex flex-col justify-center overflow-hidden">
            {/* Animated wave decoration */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <svg className="absolute bottom-0 left-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="#ffffff"
                  fillOpacity="0.2"
                  d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </motion.div>
            <div className="relative z-10">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/Logo_Orion.jpg"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="rounded-full mb-8 border-4 border-white shadow-lg"
                  priority
                />
              </motion.div>
              <motion.h1
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-5xl font-bold mb-4"
              >
                Bienvenue
              </motion.h1>
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-blue-100 mb-6 text-lg"
              >
                Connectez-vous pour accéder à toutes nos fonctionnalités et trouver les meilleures offres.
              </motion.p>
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-sm text-blue-200"
              >
                www.votresite.com
              </motion.p>
            </div>
          </div>

          {/* Right section */}
          <div className="w-full md:w-1/2 p-12 bg-white bg-opacity-60 backdrop-filter backdrop-blur-md">
            <div className="max-w-md mx-auto">
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-gray-800 mb-8 text-center"
              >
                Connexion
              </motion.h2>
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Label htmlFor="email" className="text-gray-700 font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm transition duration-200"
                    placeholder="Votre email"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm text-red-500"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Label htmlFor="motDePasse" className="text-gray-700 font-semibold">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="motDePasse"
                      type={showmotDePasse ? "text" : "password"}
                      {...register("motDePasse")}
                      className="mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm transition duration-200"
                      placeholder="Mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowmotDePasse(!showmotDePasse)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition duration-200"
                      aria-label={showmotDePasse ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showmotDePasse ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.motDePasse && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm text-red-500"
                      >
                        {errors.motDePasse.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex space-x-4"
                >
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Connexion...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Se connecter
                        <ChevronRight className="ml-2" size={20} />
                      </span>
                    )}
                  </Button>
                  <Link
                    href="/register"
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    S&apos;inscrire
                  </Link>
                </motion.div>
              </form>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <SocialButton
                    Icon={GoogleIcon}
                    text="Google"
                    gradient="bg-gradient-to-r from-green-400 to-green-600"
                    className="flex-1"
                  />
                  <SocialButton
                    Icon={Facebook}
                    text="Facebook"
                    gradient="bg-gradient-to-r from-blue-500 to-blue-700"
                    className="flex-1"
                  />
                  <SocialButton
                    Icon={Instagram}
                    text="Instagram"
                    gradient="bg-gradient-to-r from-pink-500 to-red-500"
                    className="flex-1"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mt-6 text-center"
              >
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Mot de passe oublié ?
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <defs>
        <linearGradient id="Google" x1="24" x2="24" y1="43.734" y2="4.266" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0090ff" />
          <stop offset=".325" stopColor="#3ec9ff" />
          <stop offset=".636" stopColor="#66f8ff" />
          <stop offset=".863" stopColor="#8cffff" />
          <stop offset="1" stopColor="#b2ffff" />
        </linearGradient>
      </defs>
      <path
        fill="url(#Google)"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#fff"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#fff"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#fff"
        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  )
}

