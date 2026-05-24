import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-amber-200 bg-white shadow-sm">
                <Image
                  src="/srichakra_logo_circle.png"
                  alt="SriChakra Farm"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-green-900">
                  SriChakra Farm
                </h3>
                <p className="text-xs text-zinc-600">
                  Fresh from farm, with trust
                </p>
              </div>
            </div>

            <p className="mt-3 max-w-xs text-sm text-zinc-600">
              Farm fresh fish, mutton, vegetables, and rice delivered locally.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900">
              Categories
            </h4>

            <div className="mt-3 space-y-2 text-sm text-zinc-600">
              <Link href="/category/fish/tender-seeds" className="block hover:text-green-800">
                Fish
              </Link>

              <Link href="/category/sheep" className="block hover:text-green-800">
                Sheep / Mutton
              </Link>

              <Link href="/category/vegetables" className="block hover:text-green-800">
                Vegetables
              </Link>

              <Link href="/category/rice" className="block hover:text-green-800">
                Rice
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900">
              Contact
            </h4>

            <div className="mt-3 space-y-2 text-sm text-zinc-600">
              <p>📞 +91 9603437551</p>

              <p>
                Kottala Village, Haliya Town  
                Telangana - 508278
              </p>

              <a
                href="https://wa.me/919603437551"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-green-800 hover:text-green-900"
              >
                💬 WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} SriChakra Farm
      </div>
    </footer>
  );
}