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
    <div className="grid grid-cols-2 lg:grid-cols-[80%_40%]">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text ml-6">
        <Configuration />
      </div>
      <div className="absolute inset-0 -z-50 items-center px-5 py-14 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
      <div className="bg-black w-4/6 -mx-44 h-max mt-24">
        <Carousel
          className="flex items-center justify-center"
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
                    className="rounded-lg h-50 w-80 object-cover"
                  />
                  <p className="text-center mt-4 text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {`${index + 1}. ${captions[index]}`}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
