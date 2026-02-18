import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

            {/* --- LADO ESQUERDO: Dark White Dotted Grid --- */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 bg-black overflow-hidden">
                {/* BACKGROUND */}
                <div
                    className="absolute inset-0 z-0 opacity-50"
                    style={{
                        background: "#000000",
                        backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px)`,
                        backgroundSize: "30px 30px",
                        backgroundPosition: "0 0",
                    }}
                />

                {/* CONTEÚDO (Branding) */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 w-fit">
                        <Image src="/logo.png" width={40} height={40} alt="Kovr" />
                        <span className="text-2xl font-bold text-white tracking-tight">Kovr</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
                        Join Kovr.
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Start your journey to financial freedom and stop wasting money on forgotten subscriptions.
                    </p>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <p className="text-sm font-medium text-zinc-300">Lifetime Access Assets</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-xs text-zinc-600 uppercase tracking-widest">© 2026 Kovr</p>
                </div>
            </div>

            {/* --- LADO DIREITO: Circuit Board (Light) --- */}
            <div className="relative flex items-center justify-center w-full h-full bg-[#f8fafc]">
                {/* BACKGROUND */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        background: "#f8fafc",
                        backgroundImage: `
              linear-gradient(90deg, #e2e8f0 1px, transparent 1px),
              linear-gradient(180deg, #e2e8f0 1px, transparent 1px),
              linear-gradient(90deg, #cbd5e1 1px, transparent 1px),
              linear-gradient(180deg, #cbd5e1 1px, transparent 1px)
            `,
                        backgroundSize: "50px 50px, 50px 50px, 10px 10px, 10px 10px",
                    }}
                />

                {/* CARD DO FORMULÁRIO */}
                <div className="relative z-10 w-full max-w-md p-6">
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-zinc-200">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900">Create account</h2>
                            <p className="mt-2 text-sm text-zinc-500">Sign up in seconds</p>
                        </div>

                        {/* Container forçando texto escuro para o formulário */}
                        <div className="text-zinc-900 [&_label]:text-zinc-700 [&_input]:bg-white [&_input]:border-zinc-300 [&_input]:text-zinc-900">
                            <RegisterForm />
                        </div>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-zinc-500">Already have an account? </span>
                            <Link href="/login" className="font-bold text-purple-600 hover:text-purple-700">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
