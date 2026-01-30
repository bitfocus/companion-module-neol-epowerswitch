## Neol ePowerSwitch 4 – HTTP Module

Remote control of the NeoL ePowerSwitch 4 using HTTP and regex-based polling feedback.

---

## Setup your NeoL ePowerSwitch

This module uses the **Hidden Page** feature of the ePowerSwitch.

### Enable the Hidden Page

Open the admin interface:

`http://YOUR_IP:2550/admin/control.htm`  
(port is usually **2550**)

Navigate to **Settings → Accounts**.

![Accounts configuration](https://raw.githubusercontent.com/bitfocus/companion-module-neol-epowerswitch/main/companion/documents/epower_accounts.png)

Enable **Hidden Page** and edit the **hidden** user.

![Hidden user configuration](https://raw.githubusercontent.com/bitfocus/companion-module-neol-epowerswitch/main/companion/documents/epower_hiddenuser.png)

⚠️ **Important**
- Do **NOT** set a username or password
- There is **no authentication** implemented in this module
- Select the outlets that should be controllable
- Use the red right-facing arrow to activate them  
  (The “reset only” text is just an option description)

---

## Setup Companion

1. Enter the destination **IP address** in the module configuration
2. Choose a **polling interval** (recommended: `1000–2000 ms`)
3. Create a button:
   - Select the outlet
   - Choose the switching mode:
     - **Force ON**
     - **Force OFF**
     - **Toggle**
4. Add a feedback:
   - Select the outlet
   - The button turns **green** when the outlet is ON

### Variables

The module provides variables for each outlet:  
-'$(ePower4:outlet_1)'  
-'$(ePower4:outlet_2)'  
-'$(ePower4:outlet_3)'  
-'$(ePower4:outlet_4)'  

Each variable contains `On` or `Off`.

---

For additional information about the ePowerSwitch, please refer to the manuals provided in the documents folder.
