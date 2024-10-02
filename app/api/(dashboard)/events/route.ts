import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import Event from "@/lib/modals/events";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId');

    // Validate userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user id" }),
        { status: 400 }
      );
    }

    // Validate categoryId
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid category id" }),
        { status: 400 }
      );
    }

    // Connect to database
    await connect();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }

    // Check if category exists and belongs to the user
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found or does not belong to the user" }),
        { status: 400 }
      );
    }
    // Fetch events related to the category
    const events = await Event.find({ category: categoryId});
    return new NextResponse(JSON.stringify({ events }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching events", error: error.message }), 
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) =>{
 try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId")
        const body = await request.json()
        const {title, description,date} = body
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(
              JSON.stringify({message:"Invalid or missing userID"}),{status:400}
            )
          }

          if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(
              JSON.stringify({message:"Invalid or missing categoryId"}),{status:400}
            )
          }

          await connect()

        const user = await User.findById(userId)
        if(!user){
          return new NextResponse(JSON.stringify({message:"User not found in the database"}),{status:400})
        }
        const category = await Category.findById(categoryId)
        if(!category){
          return new NextResponse(
            JSON.stringify({message: "Category not found or does not belong to the user"}),
            {
              status: 400,
            }
          );
        }

        const newEvent = new Event({
             title,
             description, 
             date, 
             user: new Types.ObjectId (userId),
             category: new Types.ObjectId (categoryId),
             
            })

            await newEvent.save()
            return new NextResponse(JSON.stringify({message:"Event created", event:newEvent}),{status:200})
 } catch (error:any) {
    return new NextResponse("Error in creating event" + error.message,{
        status:500
    })
    
 }
}
