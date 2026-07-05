import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="text-center max-w-md space-y-6">
        <h1 className="text-8xl font-serif font-bold text-primary opacity-20">404</h1>
        <h2 className="text-3xl font-serif font-semibold text-foreground">Тропа потеряна</h2>
        <p className="text-muted-foreground text-lg">
          Как исчезающее слово в горах Кавказа, эта страница, кажется, ушла в небытие. Позвольте вернуть вас на знакомую тропу.
        </p>
        <p className="text-sm text-muted-foreground italic font-serif">
          «гьалъи» — вода, источник жизни. Возвращайтесь к истоку.
        </p>
        <Link href="/" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 py-2 mt-4">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
