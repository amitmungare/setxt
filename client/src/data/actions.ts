"use server";
import { z } from "zod";
import { subscribeService } from "./services";

const subscribeSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function subscribeAction(prevState: any, formData: FormData) {

  const email = formData.get("email");

  const validatedFields = subscribeSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    console.dir(validatedFields.error.flatten().fieldErrors, { depth: null });

    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
    };
  }

  const responseData = await subscribeService(validatedFields.data.email);

    if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      errorMessage: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    console.log(responseData.error, "from action")
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      errorMessage: "Failed to Subscribe.",
    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    successMessage: "Successfully Subscribed!",
  };

}
