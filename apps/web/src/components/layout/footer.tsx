import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            We are Live &copy; 2026
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              서비스 소개
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
