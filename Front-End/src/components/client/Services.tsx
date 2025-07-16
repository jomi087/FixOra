import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious,} from "@/components/ui/carousel"
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card"

import type { Category} from "@/shared/Types/category"
import { slugify } from "@/utils/helper/slugify";
import { useScrollToHash } from "@/hooks/useScrollToHash";

interface ServiceProps {
    categories : Category[] 
}
const Services: React.FC<ServiceProps> = ({ categories }) => {
    useScrollToHash()
    return (
        <section className="w-full">
            { categories.map((cat) => (
                <div key={cat.categoryId} className="pb-12" >
                    <h2
                        className="font-serif text-xl font-medium  md:pl-5 underline"
                        id={slugify(cat.name)}
                    >
                        {cat.name}
                    </h2>

                    <Carousel className="w-full max-w-screen-xl mx-auto relative">
                        <CarouselPrevious className="absolute left-0 top-1/2 z-10 -translate-y-1/2 "/>
                        <CarouselContent className="p-5 " >
                            {cat.subcategories.map((subCat) => (
                                <CarouselItem key={subCat.subCategoryId} className="basis-[50%] sm:basis-1/3 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 mx-3 rounded-xl border-l-3 border-l-black/55 shadow-md shadow-black  p-0 h-full  ">
                                    <Card className="pt-0 rounded-xl">
                                        <div className="h-44 sm:h-48 md:h-52 lg:h-56 overflow-hidden rounded-t-xl border-b-2">
                                            <img
                                            src={subCat.image}
                                            alt={subCat.name.toUpperCase()}
                                            className="w-full h-full object-fill"
                                            loading="lazy"
                                            />
                                        </div>
                                        <CardHeader >
                                            <CardTitle className="text-center">{subCat.name.toUpperCase()}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-center">{subCat.description}</CardDescription>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                            </CarouselContent>
                        <CarouselNext className="absolute right-0 top-1/2 z-10 -translate-y-1/2 " />
                    </Carousel>
                </div>
            ))}
        </section>
    )
}

export default Services