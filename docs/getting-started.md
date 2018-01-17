# Getting started
## Virtual Box
### Installation
1. go to https://www.virtualbox.org
2. download the latest virtualbox software
3. install virtualbox

### Download a virtual box image of Linux
1. go to https://www.osboxes.org/virtualbox-images/
2. look for the wanted linux distro (e.g. Ubuntu)
3. go to the download page and download the corresponding .vdi file

### Configuration
1. Start VirtualBox Manager
2. Press *Machine/New...*
3. Select *Type*: Linux
4. Select *Version*: Ubuntu (64-bit)  
**Note:** If no 64-bit machine is available, make sure the Setting "Intel Virtualization Technology" is enabled in the host machine BIOS
5. Give the machine a name (e.g. Ubuntu64)
6. Set the memory size to at least 8GB
7. Set the hard disk to *Use an existing virtual hard disk file* and select the downloaded .vdi file
8. When the virtual machine is created, go to its *Settings*
9. Go to *General*/*Advanced* and set *Shared Clipboard*  and *Drag'n'Drop* to *Bidirectional*
9. Go to *Display* and set the *Video Memory* to the maximum value  
**Note:** Do not check *Enable 3D Acceleration* as this breaks the WebGL abilities of browser inside the guest machine
10. Go to *Network*, then *Adapter 2*
11. Check *Enable Network Adapter*, and select *Host-only Adapter* (this will allow accessing the osparc-lab servers from the host os)

### Start the virtual machine
1. Start the ubuntu machine
2. Log in using the credentials given at osboxes website (e.g. passowrd typically is *osboxes.org*)

### Make sure copy/paste is functional
Fire up a text editor in the guest OS, try copy/pasting some text from the host OS to the guest OS and vice-versa. If it works skip this step.
1. Start a terminal
2. Install the *gcc make perl* package by doing:  
```
sudo apt-get update  
sudo apt-get upgrade  
sudo apt-get install build-essentials
```
3. On the main toolbar, go to *Devices/Insert Guest Additions Package...* and follow the instructions
4. Once done reboot the virtual machine  
sudo rebbot now
5. Check that copy/paste is now functional

## Docker
### Installation
1. Start the virtual linux machine and login
2. Go to https://www.docker.com
2. Go to product page
3. Select the ubuntu platform
4. Follow the instructions to install docker:  
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common  
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -  
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

## Access to source code
### Option 1 - Access to source on host machine through Shared folders (preffered method)
#### Configure shared folders access
1. Start *VirtualBox Manager*
2. Select the virtual machine and open *Settings*
10. Go to *Shared Folders* and define new shared folder that points to where the osparc-lab project is cloned on the host machine, keep in mind the name of the share (**%ShareName%**)
#### Mount shared folder in guest os
1. Start the virtual machine and login
2. Start a terminal
3. create a folder (e.g. windowsShare):  
mkdir windowsShare
4. mount the shared folder in it:  
sudo mount -t vboxsf %ShareName% windowsShare (replace %ShareName%)

### Option 2 - Direct access to source on guest machine
**Note:** You will need to do these steps each time you create a new virtual machine. The other way is to use the shared folders approach.
#### Create the SSH key pair to access GitHub
1. Open a terminal
2. Input the following:  
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" (replace with your GitHub e-mail address)  
    - use the default proposal for storing the keys (.ssh/)
    - enter a passphrase if you wish
3. Now copy the public key to the clipboard and add it to the GitHub account:  
sudo apt-get install xclip  
xclip -sel clip < ~/.ssh/id_rsa.pub
4. Open a browser and login to https://www.github.com
5. Click on *Account/Settings*, then on *New SSH key*
6. Paste in the key (ctrl-V), press *ok*
#### Clone the repository
1. Open a terminal
2. Input the following:  
mkdir dev  
cd dev  
git clone "osparc-lab ssh address"

## Compile & run the demos
1. Start the virtual machine
2. Start a terminal
3. Access the source code folder  
cd osparc-lab/demos
4. For example build the react demo frontend by inputing:  
```
cd frontend-react  
sudo make build  
sudo make run
```
5. Open a browser and go to *localhost:6001* and enjoy!  
**Note:** To access the demo from the host os, find the internal **IP address** from the second network adapter by calling *ifconfig* in a terminal. Then from the host os browser just go to *%IPADDRESS%:6001*.
