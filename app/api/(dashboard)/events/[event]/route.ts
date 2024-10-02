import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import Event from "@/lib/modals/events";
import { NextResponse } from "next/server";
import { Types } from "mongoose";


//Get event by ID

export const GET = async (request: Request,context: {params:any}) => {
const eventId = context.params.event
try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId')
        const categoryId = searchParams.get('categoryId')

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
              JSON.stringify({ message: "Invalid or missing userId" }),
              {
                status: 400,
              }
            );
        }

        if (!categoryId ||!Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
              JSON.stringify({ message: "Invalid or missing categoryId" }),
              {
                status: 400,
              }
            );
        }

        if(!eventId){
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing eventId" }),
                {
                  status: 400,
                }
              );
        }

        await connect();

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse(
                JSON.stringify({message:"User not found in the database"}),
                {status:400})
        }
        const category = await Category.findById(categoryId);

        if(!category){
            return new NextResponse(
                JSON.stringify({ message: "Category not found or does not belong to the user" }),
                {
                  status: 400,
                }
              );
        }

        const event = await Event.findOne({
            _id: eventId,
            user: userId,
            category: categoryId,
          });

          if(!event){
            return new NextResponse(
                JSON.stringify({ message: "Event not found or does not belong to the user and category" }),
                {
                  status: 404,
                }
              );
          }
          return new NextResponse(JSON.stringify({event}),{status:200})




} catch (error:any) {
    return new NextResponse('Error in fetching event' + error.message,{status:500});    }

}


//Update event

export const PATCH = async(request:Request, content:{params:any}) => {
    const eventId = content.params.event
    try {
        const body = await request.json()
        const{title, description,date}= body
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId')
        if (!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                {
                  status: 400,
                }
              );
        }

        if(!eventId){
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing eventId " }),
                {
                  status: 404,
                }
              );
          }

          await connect();

          const user = await User.findById(userId)

        if(!user){
            return new NextResponse(
                JSON.stringify({ message: "user not found"}),
                {
                    status: 400,
                  }
            )
          }

          const event = await Event.findOne({ _id:eventId,user:userId })

          if(!event){
            return new NextResponse(
                JSON.stringify({ message: " Blog is not found" }),
                {
                  status: 400,
                }
              );
          }

          const updatedEvent = await Event.findByIdAndUpdate(
            eventId ,
           { title, description,date },
           { new: true }
    
        )

        return new NextResponse(
            JSON.stringify({message:"Event Updated", event:updatedEvent}),{status:200}
          )

    } catch (error:any) {
        return new NextResponse('Error in updating event' + error.message,{status:500});
    }
}


//Delete event

export const DELETE = async(request: Request, content:{params:any}) =>{
    const eventId = content.params.event

    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId ||!Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                {
                  status: 400,
                }
              );
        }
        if(!eventId){
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing eventId " }),
                {
                  status: 404,
                }
              );
          }
          await connect()

          const user = await User.findById(userId)

          if(!user){
            return new NextResponse(JSON.stringify({message:"User not found in the database"}),{status:400})
          }

          const event = await Event.findOne({ _id:eventId,user:userId })

          if(!event){
            return new NextResponse(
                JSON.stringify({ message: " Event is not found" }),
                {
                  status: 400,
                }
              );
          }
          await Event.findByIdAndDelete(eventId)
   return new NextResponse(JSON.stringify({ message: " Event is deleted" }),{ status:200})
    } catch (error:any) {
        return new NextResponse("Deleting event" + error.message,{status:500})

    }
}