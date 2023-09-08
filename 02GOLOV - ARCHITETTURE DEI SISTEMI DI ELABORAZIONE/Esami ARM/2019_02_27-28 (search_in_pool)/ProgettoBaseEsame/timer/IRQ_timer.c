/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_timer.c
** Last modified Date:  2014-09-25
** Last Version:        V1.00
** Descriptions:        functions to manage T0 and T1 interrupts
** Correlated files:    timer.h
**--------------------------------------------------------------------------------------------------------
*********************************************************************************************************/
#include "lpc17xx.h"
#include "timer.h"
#include "../led/led.h"

extern int count_2;
extern int display;
extern int result;

/******************************************************************************
** Function name:		Timer0_IRQHandler
**
** Descriptions:		Timer/Counter 0 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
extern unsigned char led_value;					/* defined in funct_led								*/
void TIMER0_IRQHandler (void)
{
	count_2=0;
	LPC_TIM0->IR = 1;
	return;
}


/******************************************************************************
** Function name:		Timer1_IRQHandler
**
** Descriptions:		Timer/Counter 1 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER1_IRQHandler (void)
{
  LPC_TIM1->IR = 1;			/* clear interrupt flag */
  return;
}

/******************************************************************************
** Function name:		Timer2_IRQHandler
**
** Descriptions:		Timer/Counter 2 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER2_IRQHandler (void)
{
  LPC_TIM2->IR = 1;			/* clear interrupt flag */
  return;
}

/******************************************************************************
** Function name:		Timer3_IRQHandler
**
** Descriptions:		Timer/Counter 3 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER3_IRQHandler (void)
{ 
	int res;
	if(display==1){
		LED_Out(result&0x000000ff);   
    display++;		
	}
	else if(display==2){
		res=result>>8;
		LED_Out(res&0x0000000ff); 
    display++;		
	}
	else if(display==3){
		res=result>>16;
		LED_Out(res&0x000000ff);
		display++;
	}
	else if(display==4){
		res=result>>24;
		LED_Out(res&0x000000ff);
		display++;
	}
	else{
		LED_Out(0x00);
		disable_timer(3);
		count_2=0;
		result=0;
		display=1;
	}
	
  LPC_TIM3->IR = 1;			/* clear interrupt flag */
  return;
}






/******************************************************************************
**                            End Of File
******************************************************************************/
