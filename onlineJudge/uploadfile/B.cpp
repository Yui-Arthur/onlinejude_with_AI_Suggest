#include "snake.h"
#include "snake_map.h"
#include <cstring>


computer_snake::computer_snake(snake_map*ptr,int player,char * s):snake(ptr,player,s){}


void computer_snake::change_direction(int n)
{
    int move_xy[4][2]={{-1,0},
                        {0,1},
                        {1,0},
                        {0,-1}};

    int width=map_ptr->get_width(),height=map_ptr->get_height();
    pair<int,int> closest_point;
    int min_distance=1e9;
    for(int i=1;i<=height;i++)
    {
        for(int j=1;j<=width;j++)
        {
            int tmp_distance=abs(head->position.first-i)+abs(head->position.second-j);

            
            if(map_ptr->get_point(i,j)>=5&&tmp_distance<min_distance)
            min_distance=tmp_distance,closest_point=make_pair(i,j);
        }
    }

    direction=direction_score(closest_point,min_distance);

    return;
}

int computer_snake::direction_score(pair<int,int>closest_point,int dis)
{
    int move_xy[4][2]={{-1,0},
                        {0,1},
                        {1,0},
                        {0,-1}};

    int max_score=-100;
    int max_score_direction=rand()%4;
    
    for(int d=0;d<4;d++)
    {
        pair<int,int> tmp=head->position;
        tmp.first+=move_xy[d][0];
        tmp.second+=move_xy[d][1];
        int next_point=map_ptr->get_point(tmp.first,tmp.second);
        
        if((next_point!=0&&next_point<5)||tmp==head->next->position)
        continue;

        int total_score=0;
        memset(check,0,sizeof(check));
        
        map_ptr->map_change_point(tmp.first,tmp.second,1);

        for(int j=0;j<4;j++)
        {
            if(j!=(d+2)%4)
            {
                accept_point=0;
                
                dfs(make_pair(tmp.first+move_xy[j][0],tmp.second+move_xy[j][1]));
                total_score=max(accept_point,total_score);
            }
        }

        map_ptr->map_change_point(tmp.first,tmp.second,next_point);

        if(abs(tmp.first-closest_point.first)+abs(tmp.second-closest_point.second)<dis&&total_score>length)
        total_score+=2;
        if(total_score>length)
        total_score+=3;
        else if(tmp.first==2||tmp.first==map_ptr->get_height()-1||tmp.second==2||tmp.second==map_ptr->get_width()-1)
        total_score-=1;


        if(map_ptr->get_player(1)!=this)
        {
            std::pair<int,int> other=map_ptr->get_player(1)->get_head_pos();

            if(abs(other.first-tmp.first)+abs(other.second-tmp.second)==1)
            total_score-=2;
        }
        else if(map_ptr->get_player(2)!=nullptr&&map_ptr->get_player(2)!=this)
        {
            std::pair<int,int> other=map_ptr->get_player(2)->get_head_pos();

            if(abs(other.first-tmp.first)+abs(other.second-tmp.second)==1)
            total_score-=2;
        }
        


        if(total_score>max_score)
        max_score=total_score,max_score_direction=d;

    }
    
    
    return max_score_direction;
}

void computer_snake::dfs(pair<int,int> now)
{
    int now_point=map_ptr->get_point(now.first,now.second);
    if((now_point!=0&&now_point<5)||check[now.first][now.second]==1)//||accept_point>length)
    return;
    
    check[now.first][now.second]=1;
    accept_point++;

    
    dfs(make_pair(now.first+1,now.second));
    dfs(make_pair(now.first-1,now.second));
    dfs(make_pair(now.first,now.second+1));
    dfs(make_pair(now.first,now.second-1));
    

}


unwall_computer_snake::unwall_computer_snake(snake_map*ptr,int player,char * s):computer_snake(ptr,player,s){};

bool unwall_computer_snake::move_body()
{
    int move_xy[4][2]={{-1,0},
                        {0,1},
                        {1,0},
                        {0,-1}};
    
    if(eat_food_type==0)
    {
    
        snake_body *current=tail;

        while(current->previous!=nullptr)
        {
            current->position=current->previous->position;
            current=current->previous;
        }


        

        head->position.first+=move_xy[direction][0];
        head->position.second+=move_xy[direction][1];

    }
    else
    eat_point();


    int head_point=map_ptr->get_point(head->position.first,head->position.second);

    if(head_point==1)
    {
        int width=map_ptr->get_width(),height=map_ptr->get_height();
        if(head->position.first==1)
        head->position.first=height-1;
        else if(head->position.first==height)
        head->position.first=2;
        else if(head->position.second==1)
        head->position.second=width-1;
        else if(head->position.second==width)
        head->position.second=2;

        head_point=map_ptr->get_point(head->position.first,head->position.second);
    }

    if(head_point!=0&&head_point<5)
    return 0;

    if(head_point>=5)
    eat_food_type=head_point;

    map_ptr->map_change_point(head->position.first,head->position.second,2);
    
    if((head->position.first+head->position.second)%2)
    {
        attron(COLOR_PAIR(1));
        mvprintw(map_ptr->middle.first+head->position.first,map_ptr->middle.second+60+2*head->position.second,"%s",body_element);
        attroff(COLOR_PAIR(1));
    }
    else
    {
        attron(COLOR_PAIR(2));
        mvprintw(map_ptr->middle.first+head->position.first,map_ptr->middle.second+60+2*head->position.second,"%s",body_element);
        attroff(COLOR_PAIR(2));
    }


    //💠💓💢🌟🔲🔳▒▒ ░░ ▓▓ 
    
    return 1;
}


void unwall_computer_snake::change_direction(int n)
{
    int move_xy[4][2]={{-1,0},
                        {0,1},
                        {1,0},
                        {0,-1}};

    int width=map_ptr->get_width(),height=map_ptr->get_height();
    pair<int,int> closest_point;
    int min_distance=1e9;
    for(int i=1;i<=height;i++)
    {
        for(int j=1;j<=width;j++)
        {
            int tmp_x=min(abs(head->position.first-i),abs(height-i+head->position.first));
            int tmp_y=min(abs(head->position.second-j),abs(width-j+head->position.second));
            int tmp_distance=tmp_x+tmp_y;

            if(map_ptr->get_point(i,j)>=5&&tmp_distance<min_distance)
            min_distance=tmp_distance,closest_point=make_pair(i,j);
        }
    }

    direction=direction_score(closest_point,min_distance);
    
    
    

    return;
}

int unwall_computer_snake::direction_score(pair<int,int>closest_point,int dis)
{
    int move_xy[4][2]={{-1,0},
                        {0,1},
                        {1,0},
                        {0,-1}};

    int max_score=-1;
    int max_score_direction=rand()%4;
    for(int d=0;d<4;d++)
    {
        pair<int,int> tmp=head->position;
        tmp.first+=move_xy[d][0];
        tmp.second+=move_xy[d][1];
        int next_point=map_ptr->get_point(tmp.first,tmp.second);
        
        int width=map_ptr->get_width(),height=map_ptr->get_height();

        if(next_point==1)
        {
            if(tmp.first==1)
            tmp.first=height-1;
            else if(tmp.first==height)
            tmp.first=2;
            else if(tmp.second==1)
            tmp.second=width-1;
            else if(tmp.second==width)
            tmp.second=2;

            next_point=map_ptr->get_point(tmp.first,tmp.second);
        }

        if((next_point!=0&&next_point<5)||tmp==head->next->position)
        continue;

        int total_score=0;
        memset(check,0,sizeof(check));
        
        map_ptr->map_change_point(tmp.first,tmp.second,1);

        for(int j=0;j<4;j++)
        {
            if(j!=(d+2)%4)
            {
                accept_point=0;
                
                dfs(make_pair(tmp.first+move_xy[j][0],tmp.second+move_xy[j][1]));
                total_score=max(accept_point,total_score);
            }
        }

        map_ptr->map_change_point(tmp.first,tmp.second,next_point);

        
        
        int tmp_x=min(abs(tmp.first-closest_point.first),abs(height-closest_point.first+tmp.first));
        int tmp_y=min(abs(tmp.second-closest_point.second),abs(width-closest_point.second+tmp.second));
            


        if(tmp_x+tmp_y<dis&&total_score>length)
        total_score+=2; 
        if(total_score>length)
        total_score+=3;

        if(map_ptr->get_player(1)!=this)
        {
            std::pair<int,int> other=map_ptr->get_player(1)->get_head_pos();

            if(abs(other.first-tmp.first)+abs(other.second-tmp.second)==1)
            total_score-=2;
        }
        else if(map_ptr->get_player(2)!=nullptr&&map_ptr->get_player(2)!=this)
        {
            std::pair<int,int> other=map_ptr->get_player(2)->get_head_pos();

            if(abs(other.first-tmp.first)+abs(other.second-tmp.second)==1)
            total_score-=2;
        }

        


        if(total_score>max_score)
        max_score=total_score,max_score_direction=d;

    }
    
    
    
    return max_score_direction;
}

void unwall_computer_snake::dfs(pair<int,int> now)
{
    int now_point=map_ptr->get_point(now.first,now.second);

    if(now_point==1)
    {
        int width=map_ptr->get_width(),height=map_ptr->get_height();
        if(now.first==1)
        now.first=height-1;
        else if(now.first==height)
        now.first=2;
        else if(now.second==1)
        now.second=width-1;
        else if(now.second==width)
        now.second=2;

        now_point=map_ptr->get_point(now.first,now.second);
    }


    if((now_point!=0&&now_point<5)||check[now.first][now.second]==1)//||accept_point>length)
    return;
    
    check[now.first][now.second]=1;
    accept_point++;

    
    dfs(make_pair(now.first+1,now.second));
    dfs(make_pair(now.first-1,now.second));
    dfs(make_pair(now.first,now.second+1));
    dfs(make_pair(now.first,now.second-1));
    

}

special_computer_snake::special_computer_snake(snake_map*ptr,int player,char * s):computer_snake(ptr,player,s){};


void special_computer_snake::eat_point()
{
    int move_xy[4][2]={{-1,0},
                        {0,1},
                        {1,0},
                        {0,-1}};


    if(eat_food_type!=30)
    map_ptr->random_food();     
    length++;
    

    switch (eat_food_type-6)
    {
        case 1:
            invincible+=20;
            eat_food_type=0;


            if(body_element!="⭐")
            tmp_element=body_element;

            change_body_element("⭐");
            map_ptr->print_snake();
            break;
        case 2:
            eat_food_type=30;
            break;
        case 4:
            eat_food_type=0;
            random_new_pos();
            break;
        case 5:
            transparent+=10;
            eat_food_type=0;
            break;
        default:
            eat_food_type=0;
    }

    
    
    snake_body *tmp=head;
    head=new snake_body(head->position.first+move_xy[direction][0],head->position.second+move_xy[direction][1]);
    head->next=tmp;
    tmp->previous=head;
    
    return;
}

void special_computer_snake::random_new_pos()
{

    int height=map_ptr->get_height();
    int width=map_ptr->get_width();
    // 4~height-4
    int x=random()%((height-9))+5;
    // 4~width-4
    int y=(random()%(width-9))+5;


    bool can_move=0;
    while(!can_move)
    {
        can_move=1;
        x=(random()%(height-6))+4;
        y=(random()%(width-6))+4;

        for(int i=x-3;i<=x+3;i++)
        {
            for(int j=y-3;j<=y+3;j++)
            {
                if(map_ptr->get_point(i,j)!=0)//&&map_ptr->get_point(i,j)<5);
                can_move=0;
                //mvprintw(i,50+2*j,"XX");
                
            }
        }
        
        refresh();

        //break;
        
    }
    

    if((head->position.first+head->position.second)%2)
    {
        attron(COLOR_PAIR(1));
        mvprintw(map_ptr->middle.first+head->position.first,map_ptr->middle.second+60+2*head->position.second,"  ");
        attroff(COLOR_PAIR(1));
    }
    else
    {
        attron(COLOR_PAIR(2));
        mvprintw(map_ptr->middle.first+head->position.first,map_ptr->middle.second+60+2*head->position.second,"  ");
        attroff(COLOR_PAIR(2));
    }
    map_ptr->map_change_point(head->position.first,head->position.second,0);
    head->position=make_pair(x,y);
    //mvprintw(head->position.first,50+2*head->position.second,"🌀");


}


bool special_computer_snake::move_body()
{
            
    int move_xy[4][2]={{-1,0},
                        {0,1},
                        {1,0},
                        {0,-1}};
    
    

    if(transparent!=0)
    transparent--;

    if(eat_food_type==0)
    {    

        snake_body *current=tail;

        while(current->previous!=nullptr)
        {
            current->position=current->previous->position;
            current=current->previous;
        }

        head->position.first+=move_xy[direction][0];
        head->position.second+=move_xy[direction][1];

    }
    else
    eat_point();

    
    int head_point=map_ptr->get_point(head->position.first,head->position.second);

    if(invincible==0&&head_point!=0&&head_point<5)
    return 0;

    if(head_point>=5)
    eat_food_type=head_point;


    if(head_point==1)
    {
        int width=map_ptr->get_width(),height=map_ptr->get_height();
        if(head->position.first==1)
        head->position.first=height-1;
        else if(head->position.first==height)
        head->position.first=2;
        else if(head->position.second==1)
        head->position.second=width-1;
        else if(head->position.second==width)
        head->position.second=2;

        head_point=map_ptr->get_point(head->position.first,head->position.second);
    }



    map_ptr->map_change_point(head->position.first,head->position.second,2);

    if((head->position.first+head->position.second)%2)
    {
        attron(COLOR_PAIR(1));
        if(transparent==0)
        mvprintw(map_ptr->middle.first+head->position.first,map_ptr->middle.second+60+2*head->position.second,"%s",body_element);
        else
        mvprintw(map_ptr->middle.first+head->position.first,map_ptr->middle.second+60+2*head->position.second,"  ");
        attroff(COLOR_PAIR(1));
    }
    else
    {
        attron(COLOR_PAIR(2));
        if(transparent==0)
        mvprintw(map_ptr->middle.first+head->position.first,map_ptr->middle.second+60+2*head->position.second,"%s",body_element);
        else
        mvprintw(map_ptr->middle.first+head->position.first,map_ptr->middle.second+60+2*head->position.second,"  ");
        attroff(COLOR_PAIR(2));
    }

    if(invincible!=0)
    {
        invincible--;
        if(invincible==0)
        body_element=tmp_element,map_ptr->print_snake();
        
    }

    return 1;

}