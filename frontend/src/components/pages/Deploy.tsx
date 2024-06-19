import Configuration from "./Configuration";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Deploy() {
  const images = ["./details.png", "./wait.png", "./view.png"];
  const captions = ['Submit Configuration', 'Wait for deployment', 'View the Website!!'];

  return (
    <div className="grid grid-cols-[80%_20%]">
        {/* <div className="text-4xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-4 ml-4">
          Enter your Project's Configuration
        </div> */}
      <div className="absolute inset-0 -z-50 h-full w-full items-center px-5 py-14 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        <Configuration />
      </div>
      <div className="flex flex-col -mb-44">
        <Carousel
          className="max-w-xs inset-3/4"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          orientation="horizontal"
        >
          <CarouselContent>
            {images.map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <img
                    src={images[`${index}`]}
                    alt="carousel images"
                    className="rounded-lg h-50 w-80"
                  />
                  <p className="text-center mt-4 text-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{captions[`${index}`]}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
