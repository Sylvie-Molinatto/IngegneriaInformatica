/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_RIT.c
** Last modified Date:  2014-09-25
** Last Version:        V1.00
** Descriptions:        functions to manage T0 and T1 interrupts
** Correlated files:    RIT.h
**--------------------------------------------------------------------------------------------------------
*********************************************************************************************************/
#include "lpc17xx.h"
#include "RIT.h"
#include "../led/led.h"
#include "../timer/timer.h"

/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
#define N 4
extern int find_best_3 (char DATA_IN[], int n, char BEST_3[]);
extern char DATA_IN[N];
 
char BEST_3[3];		//capire se bisogna mettere volatile

void RIT_IRQHandler (void)
{			
	static int stop=0;
	static int down=0;	
	down++;
	if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){	//leggo dal GPIO, l'11 corrisponde al tasto KEY1 CONTROLLO CHE SIA GIU
		reset_RIT();
		if(down==1){
				stop=1;
				find_best_3(DATA_IN,N,BEST_3);
				reset_timer(2);
				enable_timer(2);
		}
	}
	else {	/* button released */
		down=0;			
		disable_RIT();
		reset_RIT();
		if(stop==0)
			NVIC_EnableIRQ(EINT1_IRQn);							 /* disable Button interrupts			*/
		LPC_PINCON->PINSEL4    |= (1 << 22);     /* External interrupt 0 pin selection */
	}
		
	
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
