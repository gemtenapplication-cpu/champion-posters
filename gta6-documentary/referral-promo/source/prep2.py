"""Extra screenshots for referral + silver promos -> cx/ss/. Fixes cursor smudges by retypesetting lines; removes Gemten wording."""
import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fixtext import *
from PIL import Image, ImageFilter, ImageDraw, ImageFont
import cv2
SP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'); C=SP+'/uploads_ss/clean/'; O=SP+'/cx/ss/'
def blur(im,x,y,w,h,r=7): im.paste(im.crop((x,y,x+w,y+h)).filter(ImageFilter.GaussianBlur(r)),(x,y))
def pix(im,x,y,w,h): im.paste(im.crop((x,y,x+w,y+h)).resize((8,8)).resize((w,h),Image.NEAREST).filter(ImageFilter.GaussianBlur(3)),(x,y))
def inpaint(im,x,y,w,h):
    a=np.array(im)[:,:,::-1].copy(); m=np.zeros(a.shape[:2],np.uint8); m[y:y+h,x:x+w]=255
    return Image.fromarray(cv2.inpaint(a,m,5,cv2.INPAINT_TELEA)[:,:,::-1])
GEM=[('Create your Champion account (with your mobile or your Gemten account) and you are a ',DARK),('Silver',DARK,'SemiBold'),(' member, with a member ID and QR card in ',DARK),('Rewards',BLUE),('. Membership is free.',DARK)]
NEW=[('Create your Champion account with your mobile and you are a ',DARK),('Silver',DARK,'SemiBold'),(' member, with a member ID and QR card in ',DARK),('Rewards',BLUE),('. Membership is free.',DARK)]
# referral policy
im=Image.open(C+'dashboard_12d_knowledge_referral_part1.png').convert('RGB')
retype(im,484,1056,274,293,[('The reward is used by your next booking it can lower. It never applies to a package or a paid membership.',DARK)]); im.save(O+'kref.png')
# membership policy part1
im=Image.open(C+'dashboard_12b_knowledge_membership_part1.png').convert('RGB')
retype(im,470,1382,228,246,NEW,fitto=GEM)
retype(im,484,791,289,306,[('Silver',DARK,'SemiBold'),(': 10% off every session booked from your account.',DARK)])
im=inpaint(im,781,272,20,15); im.save(O+'kmem1.png')
# membership part2
im=Image.open(C+'dashboard_12b_knowledge_membership_part2.png').convert('RGB')
retype(im,470,1382,99,117,NEW,fitto=GEM)
retype(im,484,1456,268,286,[('The member discount applies to standard sessions. It does not apply to packages and offers (Day Play, Student Hour, Squad Pack, Full Zone...), which already have their own price.',DARK)])
im.save(O+'kmem2.png')
# points policy
im=Image.open(C+'dashboard_12c_knowledge_points_part1.png').convert('RGB')
retype(im,484,815,275,292,[('Points show in ',DARK),('Rewards',BLUE),(' with the date and what they were for.',DARK)])
im.save(O+'kpts.png')
# rewards part1: QR, member ID, smudge on card
im=Image.open(C+'dashboard_05_rewards-points_part1.png').convert('RGB')
pix(im,898,142,92,92); blur(im,238,265,215,22); im=inpaint(im,778,280,26,22); im.save(O+'rw1x.png')
# rewards part2: member ID + generic referral link
im=Image.open(C+'dashboard_05_rewards-points_part2.png').convert('RGB'); blur(im,238,84,225,22)
d=ImageDraw.Draw(im); bg=im.getpixel((1300,379)); d.rectangle([914,368,1430,392],fill=bg)
f=ImageFont.truetype(FD%'Regular',12.2); d.text((918,372),'https://champion.gemten.com.bd/r/',font=f,fill=(40,40,48))
x=918+f.getlength('https://champion.gemten.com.bd/r/'); d.text((x,372),'YOURCODE',font=ImageFont.truetype(FD%'SemiBold',12.2),fill=BLUE)
im.save(O+'rwr.png')
print('ok')
