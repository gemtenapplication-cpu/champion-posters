"""Clean screenshots -> cx/ss/<key>.png with privacy/price masks. Coordinates are full-res (1568 wide)."""
from PIL import Image, ImageFilter, ImageDraw
import os
D=os.path.dirname(os.path.abspath(__file__)); C=os.path.join(D,'../uploads_ss/clean/')
MAP={
 'feed1':'community_01_feed_part1','feed2':'community_01_feed_part2','feed3':'community_01_feed_part3','lb':'community_02_leaderboard_part1',
 'chal':'community_03_challenges_part1','teams':'community_04_teams_part1','tprof':'community_05_team_profile_test-team_part1',
 'tour':'community_06_tournaments_part1','msgs':'community_07_messages_part1','chat':'community_08_messages_chat-tahjibul_part1',
 'chatgg':'community_10_messages_chat-siyam_part1','find':'community_11_find-players_part1','post':'community_12_post-detail_part1',
 'prof1':'community_13_player-profile_part1','prof2':'community_13_player-profile_part2','org':'community_14_organizer-champion_part1',
 'ov1':'dashboard_01_overview_part1','ov2':'dashboard_01_overview_part2','ov3':'dashboard_01_overview_part3','ov4':'dashboard_01_overview_part4',
 'ov5':'dashboard_01_overview_part5','book1':'dashboard_02_book-a-slot_part1','book2':'dashboard_02_book-a-slot_part2','mybk':'dashboard_03_my-bookings_part1',
 'bkd1':'dashboard_04_booking-detail_part1','bkd2':'dashboard_04_booking-detail_part2','rw1':'dashboard_05_rewards-points_part1','rw2':'dashboard_05_rewards-points_part2',
 'myteams':'dashboard_06_my-teams_part1','dtour':'dashboard_07_tournaments_part1','live':'dashboard_08_live-chat_part1','tickets':'dashboard_09_tickets_part1',
 'billing':'dashboard_10_billing_part1','contact':'dashboard_11_contact_part1','know':'dashboard_12a_knowledge_house-rules_part1',
 'kmem':'dashboard_12b_knowledge_membership_part1','price1':'dashboard_13_prices-offers_part1','price2':'dashboard_13_prices-offers_part2',
 'price4':'dashboard_13_prices-offers_part4','price5':'dashboard_13_prices-offers_part5','activity':'dashboard_14_activity-log_part1',
 'pset2':'dashboard_15_profile-settings_part2','pset3':'dashboard_15_profile-settings_part3','notif':'dashboard_16_notifications_part1',
}
# (kind, x, y, w, h): blur | pix | fill(color sampled at left-top-2)
M={
 'prof1':[('fill',902,116,130,32)],                                    # "Gemten profile" button
 'ov1':[('blur',318,190,215,22)],                                      # member ID
 'ov3':[('blur',378,176,150,26)],                                      # "from ৳… / hour"
 'ov5':[('blur',1036,238,46,22),('blur',250,466,118,32),('blur',432,466,118,32),('blur',613,466,120,32),('blur',794,466,122,32),('blur',1130,273,340,34)],
 'book1':[('blur',628,462,62,20),('blur',888,462,62,20)],
 'book2':[('blur',628,318,62,20),('blur',888,318,62,20),('blur',628,430,62,20)],
 'mybk':[('blur',824,152,46,22)],
 'bkd1':[('pix',1030,384,90,90),('blur',876,532,44,22)],
 'bkd2':[('pix',1030,76,90,92),('blur',876,228,44,20),('blur',632,265,44,20)],
 'rw1':[('pix',898,142,92,92),('blur',238,265,215,22)],
 'rw2':[('blur',900,360,540,36),('blur',238,84,225,22)],
 'price1':[('blur',805,505,60,60),('blur',1462,505,60,60)],
 'price2':[('blur',805,60,60,460),('blur',1462,60,60,460)],
 'price4':[('blur',238,215,130,30),('blur',677,215,130,30),('blur',1115,215,130,30),('blur',238,393,130,30),('blur',677,393,130,30),('blur',1115,393,130,30)],
 'price5':[('blur',238,190,70,32),('blur',677,190,70,32)],
 'pset2':[('blur',636,66,240,48)],
 'activity':[('blur',1370,165,160,95)],
 'notif':[('blur',1078,198,64,26),('blur',1078,265,64,26)],
}
os.makedirs(os.path.join(D,'ss'),exist_ok=True)
for k,f in MAP.items():
    im=Image.open(C+f+'.png').convert('RGB')
    for kind,x,y,w,h in M.get(k,[]):
        box=(x,y,x+w,y+h); reg=im.crop(box)
        if kind=='blur': reg=reg.filter(ImageFilter.GaussianBlur(7))
        elif kind=='pix': reg=reg.resize((8,8)).resize((w,h),Image.NEAREST).filter(ImageFilter.GaussianBlur(3))
        elif kind=='fill': reg=Image.new('RGB',(w,h),im.getpixel((x-4,y+h//2)))
        im.paste(reg,box)
    im.save(os.path.join(D,'ss',k+'.png'))
print('ok',len(MAP))
# remove test entry "2 · 123" from the Most wanted games panel
import numpy as np, cv2
ref=cv2.cvtColor(cv2.imread(os.path.join(D,'ss','feed1.png')),cv2.COLOR_BGR2GRAY); tpl=ref[333:356,1062:1240].copy()
for k in ['feed1','feed2','feed3','lb','chal','teams','tprof','tour','find','post','prof1','prof2','org']:
    p=os.path.join(D,'ss',k+'.png'); im=Image.open(p).convert('RGB'); g=cv2.cvtColor(np.array(im)[:,:,::-1],cv2.COLOR_BGR2GRAY)
    r=cv2.matchTemplate(g,tpl,cv2.TM_CCOEFF_NORMED); _,mx,_,(x,y)=cv2.minMaxLoc(r)
    if mx<0.8: print('mw skip',k,round(mx,2)); continue
    hy=y-(333-337)  # header top
    hy=y+4; x0=x-6
    seg=im.crop((x0,hy+61,x0+262,hy+88)); im.paste(seg,(x0,hy+42)); col=im.getpixel((x0+255,hy+80))
    im.paste(Image.new('RGB',(262,19),col),(x0,hy+69)); im.save(p); print('mw',k,x,y)
