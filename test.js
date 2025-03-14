// const { Builder, By, until } = require('selenium-webdriver');
// require('chromedriver');

// (async function addUserTest() {
//   let driver = await new Builder().forBrowser('chrome').build();
  
//   try {
//     // Step 1: Open the app
//     await driver.get('http://localhost:3000'); // Update with your actual URL if different
    
//     await driver.sleep(2000);

//     // Step 2: Fill out the form to add a user
//     await driver.findElement(By.xpath("//input[@placeholder='Name']")).sendKeys('John Doe');
//     await driver.sleep(1000);
//     await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys('john.doe@example.com');
//     await driver.sleep(1000);

    
//     // Step 3: Submit the form to add the user
//     await driver.findElement(By.css('button.btn.btn-primary')).click();
//     await driver.sleep(3000);

//     // Step 4: Wait for the user list to update and check if the user is added
//     await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'John Doe')]")), 5000);
    
//     // Step 5: Verify the new user is in the list
//     let newUser = await driver.findElement(By.xpath("//li[contains(text(), 'John Doe')]"));
//     let newUserText = await newUser.getText();
//     console.log(newUserText); // Should print "John Doe (johndoe@example.com)"

//     // Optionally, assert if you need to automate verification
//     if (newUserText.includes('John Doe')) {
//       console.log('User added successfully!');
//     } else {
//       console.log('Test failed');
//     }
//   } finally {
//     // Close the browser after the test
//     await driver.sleep(5000);
//     await driver.quit();
//   }
// })();


const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('selenium-webdriver/chromium'); // Import to use selenium-manager

(async function addUserTest() {
  // Run in headless mode for Jenkins
  let options = new chrome.Options();
  options.addArguments('headless');  // Add 'headless' argument to run without UI
  options.addArguments('no-sandbox');  // Add no-sandbox argument (common for Jenkins environments)
  options.addArguments('disable-dev-shm-usage'); // Prevents crashing in CI environments

  // Let selenium-manager automatically handle driver
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();


  try {
    console.log('🚀 Starting Selenium UI Test');

    // Step 1: Open the app
    await driver.get('http://localhost:3000'); // Update this if needed
    console.log('✅ Opened application');
    await driver.sleep(2000);

    // Step 2: Fill out the form
    await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Name']")), 5000).sendKeys('John Doe');
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Email']")), 5000).sendKeys('john.doe@example.com');
    await driver.sleep(1000);
    console.log('✅ Entered user details');

    // Step 3: Submit the form
    await driver.wait(until.elementLocated(By.css('button.btn.btn-primary')), 5000).click();
    console.log('✅ Submitted form');
    await driver.sleep(3000);

    // Step 4: Verify user added
    let newUser = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'John Doe')]")), 5000);
    let newUserText = await newUser.getText();

    if (newUserText.includes('John Doe')) {
      console.log('🎉 User added successfully!');
    } else {
      throw new Error('❌ Test Failed: User not found in the list');
    }
  } catch (error) {
    console.error(`⚠️ Test Error: ${error.message}`);
    process.exit(1); // Make Jenkins fail the build if test fails
  } finally {
    await driver.quit();
    await driver.sleep(5000);
  }
})();
