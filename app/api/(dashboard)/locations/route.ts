import connect from "@/lib/db";
import Location from "@/lib/modals/location";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request: Request) => {
try {
    await connect()
    const locations = await Location.find();
    return new NextResponse(JSON.stringify(locations), { status: 200 });
} catch (error:any) {
    return new NextResponse("Error in fetching location" + error.message, {
        status: 500,
      }); 
}
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect()
        const newLocation = new Location(body);
        await newLocation.save();
        return new NextResponse(
            JSON.stringify({ message: "Location is created", location: newLocation }),
            { status: 200 }
          );
    } catch (error: any) {
        return new NextResponse("Error in creating location" + error.message, {
          status: 500,
        });
      }
    };

