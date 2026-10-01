#!/usr/bin/env python3
"""
Generates CHARS.fprg -- a runnable Flowgorithm program that mirrors the
CHARS pseudocode (Section 3 of the report) using parallel arrays, since
Flowgorithm has no record/struct type.

Verified against:
 - Real-world .fprg files (IamLAM/Flowgorithm, timoteoponce/flowgorithm-examples)
 - Flowgorithm's official expression syntax (true/false, &&, ||, =, &)
 - Python2FlowgorithmCompiler's test-verified schema (for/while have NO nested <body>)
"""
import base64
import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom

AUTHOR = "Mohamed"
NOW = datetime.datetime.now()
TS = NOW.strftime("%Y-%m-%d %H:%M:%S")

root = ET.Element("flowgorithm", fileversion="2.11")

attrs = ET.SubElement(root, "attributes")
ET.SubElement(attrs, "attribute", name="name", value="CHARS")
ET.SubElement(attrs, "attribute", name="authors", value=AUTHOR)
ET.SubElement(attrs, "attribute", name="about",
              value="Community Health Access and Referral System - PROG101 Assignment 1")
ET.SubElement(attrs, "attribute", name="saved", value=TS)
created_tok = f"{AUTHOR};LIMKOKWING;{NOW.strftime('%Y-%m-%d')};{NOW.strftime('%H:%M:%S')};1"
ET.SubElement(attrs, "attribute", name="created",
              value=base64.b64encode(created_tok.encode()).decode())
ET.SubElement(attrs, "attribute", name="edited",
              value=base64.b64encode(created_tok.encode()).decode())

CLINICS = [
    ("Njala Health Post",            "true",  0,  0),
    ("Gondama Health Post",          "true",  3,  0),
    ("Kenema Government Hospital",   "true",  5, 12),
    ("Bo Government Hospital",       "false", 2,  0),
    ("Serabu Health Centre",         "false", 0,  6),
]

def declare(parent, name, type_, array="False", size=""):
    ET.SubElement(parent, "declare", name=name, type=type_, array=array, size=size)

def assign(parent, variable, expression):
    ET.SubElement(parent, "assign", variable=variable, expression=expression)

def output(parent, expression, newline="True"):
    ET.SubElement(parent, "output", expression=expression, newline=newline)

def input_(parent, variable):
    ET.SubElement(parent, "input", variable=variable)

def call(parent, expression):
    ET.SubElement(parent, "call", expression=expression)

def comment(parent, text):
    ET.SubElement(parent, "comment", text=text)

def str_lit(s):
    return '"' + s.replace('"', '""') + '"'

# ---------------------------------------------------------------- Main ----
main_func = ET.SubElement(root, "function", name="Main", type="None", variable="")
ET.SubElement(main_func, "parameters")
mb = ET.SubElement(main_func, "body")

comment(mb, "CHARS - sample clinic dataset (nearest-first). In production this would be")
comment(mb, "populated from a live clinic database rather than hard-coded here.")
declare(mb, "clinicName", "String", array="True", size="5")
declare(mb, "clinicDoctorOnDuty", "Boolean", array="True", size="5")
declare(mb, "clinicOpenSlots", "Integer", array="True", size="5")
declare(mb, "clinicACTStock", "Integer", array="True", size="5")
declare(mb, "choice", "Integer")

for i, (name, doc, slots, stock) in enumerate(CLINICS):
    assign(mb, f"clinicName[{i}]", str_lit(name))
    assign(mb, f"clinicDoctorOnDuty[{i}]", doc)
    assign(mb, f"clinicOpenSlots[{i}]", str(slots))
    assign(mb, f"clinicACTStock[{i}]", str(stock))

output(mb, str_lit("===================================="))
output(mb, str_lit("  CHARS - Community Health Access"))
output(mb, str_lit("        and Referral System"))
output(mb, str_lit("===================================="))
output(mb, str_lit("1. Check Clinic Availability"))
output(mb, str_lit("2. Check ACT (Malaria Medicine) Stock"))
output(mb, str_lit("3. Book Appointment"))
output(mb, str_lit("4. Emergency Referral"))
output(mb, str_lit("Enter your choice (1-4):"))
input_(mb, "choice")

if1 = ET.SubElement(mb, "if", expression="choice = 1")
then1 = ET.SubElement(if1, "then")
call(then1, "checkAvailability(clinicName, clinicDoctorOnDuty, clinicOpenSlots)")
else1 = ET.SubElement(if1, "else")

if2 = ET.SubElement(else1, "if", expression="choice = 2")
then2 = ET.SubElement(if2, "then")
call(then2, "checkMedicineStock(clinicName, clinicACTStock)")
else2 = ET.SubElement(if2, "else")

if3 = ET.SubElement(else2, "if", expression="choice = 3")
then3 = ET.SubElement(if3, "then")
call(then3, "bookAppointment(clinicName, clinicOpenSlots)")
else3 = ET.SubElement(if3, "else")

if4 = ET.SubElement(else3, "if", expression="choice = 4")
then4 = ET.SubElement(if4, "then")
call(then4, "referEmergency(clinicName, clinicDoctorOnDuty)")
else4 = ET.SubElement(if4, "else")
output(else4, str_lit("Invalid option. Please run again and choose 1-4."))

# ------------------------------------------------- checkAvailability() ----
f1 = ET.SubElement(root, "function", name="checkAvailability", type="None", variable="")
p1 = ET.SubElement(f1, "parameters")
ET.SubElement(p1, "parameter", name="names", type="String", array="True")
ET.SubElement(p1, "parameter", name="doctorOnDuty", type="Boolean", array="True")
ET.SubElement(p1, "parameter", name="openSlots", type="Integer", array="True")
b1 = ET.SubElement(f1, "body")

declare(b1, "i", "Integer")
declare(b1, "found", "Boolean")
assign(b1, "i", "0")
assign(b1, "found", "false")
output(b1, str_lit("Searching nearby clinics for a doctor on duty and an open slot..."))
w1 = ET.SubElement(b1, "while", expression="i <= 4 && found = false")
ifw1 = ET.SubElement(w1, "if", expression="doctorOnDuty[i] = true && openSlots[i] > 0")
thenw1 = ET.SubElement(ifw1, "then")
output(thenw1, 'names[i] & " - " & openSlots[i] & " slot(s) available"')
assign(thenw1, "found", "true")
ET.SubElement(ifw1, "else")
assign(w1, "i", "i + 1")
ifend1 = ET.SubElement(b1, "if", expression="found = false")
thenend1 = ET.SubElement(ifend1, "then")
output(thenend1, str_lit("No clinic with both a doctor on duty and an open slot was found nearby."))
ET.SubElement(ifend1, "else")

# ------------------------------------------------ checkMedicineStock() ----
f2 = ET.SubElement(root, "function", name="checkMedicineStock", type="None", variable="")
p2 = ET.SubElement(f2, "parameters")
ET.SubElement(p2, "parameter", name="names", type="String", array="True")
ET.SubElement(p2, "parameter", name="stock", type="Integer", array="True")
b2 = ET.SubElement(f2, "body")

declare(b2, "i", "Integer")
declare(b2, "anyFound", "Boolean")
assign(b2, "anyFound", "false")
output(b2, str_lit("Checking nearby clinics for ACT (Artemisinin-based Combination Therapy) stock..."))
for2 = ET.SubElement(b2, "for", variable="i", start="0", end="4", direction="inc", step="1")
if2b = ET.SubElement(for2, "if", expression="stock[i] > 0")
then2b = ET.SubElement(if2b, "then")
output(then2b, 'names[i] & " has " & stock[i] & " unit(s) of ACT in stock"')
assign(then2b, "anyFound", "true")
ET.SubElement(if2b, "else")
ifend2 = ET.SubElement(b2, "if", expression="anyFound = false")
thenend2 = ET.SubElement(ifend2, "then")
output(thenend2, str_lit("ACT is not currently in stock at any nearby clinic."))
ET.SubElement(ifend2, "else")

# -------------------------------------------------- bookAppointment() -----
f3 = ET.SubElement(root, "function", name="bookAppointment", type="None", variable="")
p3 = ET.SubElement(f3, "parameters")
ET.SubElement(p3, "parameter", name="names", type="String", array="True")
ET.SubElement(p3, "parameter", name="openSlots", type="Integer", array="True")
b3 = ET.SubElement(f3, "body")

declare(b3, "clinicNumber", "Integer")
declare(b3, "idx", "Integer")
output(b3, str_lit("1=Njala  2=Gondama  3=Kenema Govt  4=Bo Govt  5=Serabu"))
output(b3, str_lit("Enter clinic number to book (1-5):"))
input_(b3, "clinicNumber")
assign(b3, "idx", "clinicNumber - 1")
if3b = ET.SubElement(b3, "if", expression="openSlots[idx] > 0")
then3b = ET.SubElement(if3b, "then")
output(then3b, '"Appointment confirmed at " & names[idx]')
else3b = ET.SubElement(if3b, "else")
output(else3b, '"No slots available at " & names[idx] & ". Suggesting the next available clinic..."')

# -------------------------------------------------- referEmergency() ------
f4 = ET.SubElement(root, "function", name="referEmergency", type="None", variable="")
p4 = ET.SubElement(f4, "parameters")
ET.SubElement(p4, "parameter", name="names", type="String", array="True")
ET.SubElement(p4, "parameter", name="doctorOnDuty", type="Boolean", array="True")
b4 = ET.SubElement(f4, "body")

declare(b4, "isEmergency", "Boolean")
declare(b4, "i", "Integer")
declare(b4, "found", "Boolean")
output(b4, str_lit("Is this an emergency? (true = yes / false = no):"))
input_(b4, "isEmergency")
if4b = ET.SubElement(b4, "if", expression="isEmergency = true")
then4b = ET.SubElement(if4b, "then")
assign(then4b, "i", "0")
assign(then4b, "found", "false")
w4 = ET.SubElement(then4b, "while", expression="i <= 4 && found = false")
ifw4 = ET.SubElement(w4, "if", expression="doctorOnDuty[i] = true")
thenw4 = ET.SubElement(ifw4, "then")
output(thenw4, '"URGENT REFERRAL: Proceed to " & names[i] & " immediately"')
assign(thenw4, "found", "true")
ET.SubElement(ifw4, "else")
assign(w4, "i", "i + 1")
ifend4 = ET.SubElement(then4b, "if", expression="found = false")
thenend4 = ET.SubElement(ifend4, "then")
output(thenend4, str_lit("No nearby clinic available. Contact the district hospital hotline immediately."))
ET.SubElement(ifend4, "else")
else4b = ET.SubElement(if4b, "else")
output(else4b, str_lit("Symptoms not flagged as an emergency. Please use Book Appointment instead."))

# --------------------------------------------------------------- write ----
xml_bytes = ET.tostring(root, encoding="utf-8")
pretty = minidom.parseString(xml_bytes).toprettyxml(indent="    ")
pretty = "\n".join(line for line in pretty.split("\n") if line.strip())
pretty = pretty.replace('<?xml version="1.0" ?>', '<?xml version="1.0"?>')

with open("diagrams/CHARS.fprg", "w", encoding="utf-8") as f:
    f.write(pretty)

print("Wrote diagrams/CHARS.fprg")
