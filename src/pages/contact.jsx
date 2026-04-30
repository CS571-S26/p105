const EMAIL = "authenticit.yidu@gmail.com";

export default function Contact() {
  return (
    <div className="px-48 py-16 flex justify-between items-start font-['Outfit',_sans-serif]">
      <div>
        <h1 className="text-5xl font-light text-rose-200 tracking-wide mb-12">
          contact
        </h1>
        <div className="text-sm text-stone-400 space-y-1 mb-12">
          <p>
            <span>email </span>
            <a
              href={"mailto:" + EMAIL}
              className="hover:text-rose-300 transition-colors"
            >
              {EMAIL}
            </a>
          </p>
          <p>Curious about collaborating? Feel free to get in touch.</p>
        </div>
        <div className="flex gap-4">
          <a
            href="https://www.etsy.com/shop/Authenticityi"
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 rounded-full border border-rose-200 hover:border-rose-300 transition-colors"
          />
          <a
            href="https://www.instagram.com/authenticityi/"
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 rounded-full border border-rose-200 hover:border-rose-300 transition-colors"
          />
          <a
            href={"mailto:" + EMAIL}
            className="w-7 h-7 rounded-full border border-rose-200 hover:border-rose-300 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
