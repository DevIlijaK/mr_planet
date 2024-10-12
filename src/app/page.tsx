import Image from "next/image";
import bg from "../../public/images/background.gif";
import planet from "../../public/images/planet-water.png";

export default function HomePage() {
  return (
    <main className="text-white">
      <div className="grid h-screen w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-12">
        <Image
          priority
          sizes="100vw"
          src={bg}
          alt="background-image"
          className="-z-50 h-screen w-full object-cover object-center"
          fill
        />
        <div className="flex h-auto flex-col justify-between rounded-3xl border border-solid bg-transparent align-middle">
          <div className="flex h-full w-full">
            <div className="flex items-start justify-start">
              <div className="h-36 w-36">
                <Image src={planet} alt="planet" objectFit="cover" />
              </div>
            </div>
          </div>
          <div className="mt-4">asd</div>
        </div>

        <div className="flex h-auto flex-col justify-between rounded-3xl border border-solid bg-transparent align-middle">
          <div className="flex h-full w-full">
            <div className="flex items-start justify-start">
              <div className="h-36 w-36">
                <Image src={planet} alt="planet" objectFit="cover" />
              </div>
            </div>
          </div>
          <div className="mt-4">asd</div>
        </div>
        <div className="flex h-auto flex-col justify-between rounded-3xl border border-solid bg-transparent align-middle">
          <div className="flex h-full w-full">
            <div className="flex items-start justify-start">
              <div className="h-36 w-36">
                <Image src={planet} alt="planet" objectFit="cover" />
              </div>
            </div>
          </div>
          <div className="mt-4">asd</div>
        </div>
      </div>
    </main>
  );
}
