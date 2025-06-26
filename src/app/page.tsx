import Image from "next/image";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center flex-1 gap-8 py-16">
      <h1 className="text-4xl font-bold text-pink-600 drop-shadow-lg">Available Book Nails Art</h1>
      <p className="text-lg text-black max-w-md text-center">
        Temukan dan booking slot kosong untuk nail art favoritmu! Login sebagai user untuk melihat jadwal, atau sebagai admin untuk mengelola slot.
      </p>
      <div className="flex gap-4 mt-6">
        <a href="/user/login" className="px-6 py-3 rounded-lg bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition">Login User</a>
        <a href="/admin/login" className="px-6 py-3 rounded-lg bg-gray-200 text-pink-700 font-semibold shadow hover:bg-gray-300 transition">Login Admin</a>
        </div>
    </section>
  );
}
