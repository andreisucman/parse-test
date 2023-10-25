require("dotenv").config();

Parse.Cloud.define("testFunction", async (req, res) => {
  try {
    const Jobs = Parse.Object.extend("Jobs");
    const newJob = new Jobs();
    newJob.set("name", "test2");
    newJob.set("icmsId", `${Math.random().toString().slice(15)}`);
    await newJob.save(null, { useMasterKey: true });

    console.log("Success");

    return { status: true };
  } catch (err) {
    console.log("Error:", err.message);
  }
});
