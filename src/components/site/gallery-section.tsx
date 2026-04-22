import Image from "next/image";

type Tile = {
  title: string;
  image: string;
  hiddenOnMobile?: boolean;
  serifOnly?: boolean;
};

const tiles: Tile[] = [
  {
    title: "Oh\nBaby",
    image:
      "https://images.pexels.com/photos/3950478/pexels-photo-3950478.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    title: "Chrzest\nSwiety",
    image:
      "https://images.pexels.com/photos/5760866/pexels-photo-5760866.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    title: "Happy\nBirthday",
    image:
      "https://images.pexels.com/photos/1561504/pexels-photo-1561504.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    hiddenOnMobile: true,
  },
  {
    title: "18",
    image:
      "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    hiddenOnMobile: true,
    serifOnly: true,
  },
];

export function GallerySection() {
  return (
    <section
      id="realizacje"
      className="grid grid-cols-2 border-t border-beige bg-beige lg:grid-cols-5"
    >
      {tiles.slice(0, 2).map((tile) => (
        <GalleryTile key={tile.title} tile={tile} />
      ))}

      <div className="group relative col-span-2 flex h-56 cursor-pointer flex-col items-center justify-center overflow-hidden bg-primary p-8 text-center sm:h-72 md:h-80 lg:col-span-1 lg:h-[450px]">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <svg
          className="relative z-10 mb-6 h-12 w-12 text-white transition-transform group-hover:scale-110"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
        </svg>
        <h3 className="relative z-10 mb-8 font-serif text-2xl leading-tight text-white md:text-3xl">
          Zobacz nasze realizacje
          <br />
          na Instagramie!
        </h3>
        <button className="relative z-10 rounded-full border border-white bg-transparent px-8 py-3.5 text-[12px] font-bold tracking-widest text-white uppercase transition-all duration-300 hover:bg-white hover:text-primary">
          OBSERWUJ NAS
        </button>
      </div>

      {tiles.slice(2).map((tile) => (
        <GalleryTile key={tile.title} tile={tile} />
      ))}
    </section>
  );
}

function GalleryTile({ tile }: { tile: Tile }) {
  return (
    <div
      className={`group relative overflow-hidden h-56 sm:h-72 md:h-80 lg:h-[450px] ${
        tile.hiddenOnMobile ? "hidden md:block" : ""
      }`}
    >
      <div className="absolute inset-0 z-10 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        {tile.serifOnly ? (
          <span className="font-serif text-6xl font-bold tracking-tighter text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] md:text-7xl">
            {tile.title}
          </span>
        ) : (
          <span className="text-center font-script text-4xl leading-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl">
            {tile.title.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        )}
      </div>
      <Image
        src={tile.image}
        alt={`Galeria - ${tile.title.replace("\n", " ")}`}
        fill
        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
      />
    </div>
  );
}
