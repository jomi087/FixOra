import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious,} from "@/components/ui/carousel"
import { Card,CardAction,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card"

import type { Category, MainCategory } from "@/shared/Types/category"

interface ServiceProps {
    categories : MainCategory[] //Category
}
const Services: React.FC<ServiceProps> = ({ categories }) => {
    console.log("jomi",categories)
    return (
        <>
            { categories.map((cat) => (
                <div className="py-5">
                    <h1 key={cat.categoryId} className="font-serif text-2xl font-medium px-5 pb-4">{cat.name}</h1>
                    <Carousel className="w-full max-w-screen-xl mx-auto relative pl-2">
                        <CarouselPrevious className="absolute left-0 top-1/2 z-10 -translate-y-1/2 "/>
                            <CarouselContent>
                                <CarouselItem className="sm:basic-1/1 md:basis-1/3 lg:basis-1/4 mx-2 ">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Card Title</CardTitle>
                                            <CardDescription>Card Description</CardDescription>
                                            <CardAction>Card Action</CardAction>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Card Content</p>
                                        </CardContent>
                                        <CardFooter>
                                            <p>Card Footer</p>
                                        </CardFooter>
                                    </Card>
                                </CarouselItem>
                            
                                <CarouselItem className="sm:basic-1/1 md:basis-1/3 lg:basis-1/4 mx-2 ">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Card Title</CardTitle>
                                                <CardDescription>Card Description</CardDescription>
                                                <CardAction>Card Action</CardAction>
                                            </CardHeader>
                                            <CardContent>
                                                <p>Card Content</p>
                                            </CardContent>
                                            <CardFooter>
                                                <p>Card Footer</p>
                                            </CardFooter>
                                        </Card>
                                </CarouselItem>
                            
                                <CarouselItem className="sm:basic-1/1 md:basis-1/3 lg:basis-1/4 mx-2 ">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Card Title</CardTitle>
                                            <CardDescription>Card Description</CardDescription>
                                            <CardAction>Card Action</CardAction>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Card Content</p>
                                        </CardContent>
                                        <CardFooter>
                                            <p>Card Footer</p>
                                        </CardFooter>
                                    </Card>
                                </CarouselItem>
                            
                                <CarouselItem className="sm:basic-1/1 md:basis-1/3 lg:basis-1/4 mx-2 ">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Card Title</CardTitle>
                                            <CardDescription>Card Description</CardDescription>
                                            <CardAction>Card Action</CardAction>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Card Content</p>
                                        </CardContent>
                                        <CardFooter>
                                            <p>Card Footer</p>
                                        </CardFooter>
                                    </Card>
                                </CarouselItem>
                            
                                <CarouselItem className="sm:basic-1/1 md:basis-1/3 lg:basis-1/4 mx-2 ">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Card Title</CardTitle>
                                                <CardDescription>Card Description</CardDescription>
                                                <CardAction>Card Action</CardAction>
                                            </CardHeader>
                                            <CardContent>
                                                <p>Card Content</p>
                                            </CardContent>
                                            <CardFooter>
                                                <p>Card Footer</p>
                                            </CardFooter>
                                        </Card>
                                </CarouselItem>
                            
                                <CarouselItem className="sm:basic-1/1 md:basis-1/3 lg:basis-1/4 mx-2 ">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Card Title</CardTitle>
                                            <CardDescription>Card Description</CardDescription>
                                            <CardAction>Card Action</CardAction>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Card Content</p>
                                        </CardContent>
                                        <CardFooter>
                                            <p>Card Footer</p>
                                        </CardFooter>
                                    </Card>
                                </CarouselItem>
                            
                            </CarouselContent>
                        <CarouselNext className="absolute right-0 top-1/2 z-10 -translate-y-1/2 " />
                    </Carousel>
                </div>
            ))}
        </>
    )
}

export default Services