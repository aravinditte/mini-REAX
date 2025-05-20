import { run } from "hardhat";
import { readFileSync } from "fs";
import { join } from "path";

async function main() {
  const networkName = process.env.HARDHAT_NETWORK || "hardhat";
  const deploymentsDir = join(__dirname, "../deployments", networkName);
  const deploymentData = JSON.parse(
    readFileSync(join(deploymentsDir, "deployment.json"), "utf-8")
  );

  for (const [contractName, contractData] of Object.entries(deploymentData.contracts)) {
    console.log(`Verifying ${contractName}...`);
    try {
      await run("verify:verify", {
        address: contractData.address,
        constructorArguments: [], // Add constructor args if needed
      });
      console.log(`${contractName} verified successfully`);
    } catch (error) {
      console.error(`Verification failed for ${contractName}:`, error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
