import Parse from "parse";
Parse.initialize(process.env.NEXT_PUBLIC_APP_ID);
Parse.serverURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/parse`;

type props = {
  name: string;
  params?: any;
};

export async function callCloudFunction({ name, params }: props) {
  try {
    return await Parse.Cloud.run(name, params);
  } catch (err) {
    return err;
  }
}
